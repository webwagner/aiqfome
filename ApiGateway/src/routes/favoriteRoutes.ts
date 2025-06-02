import { Router, Request, Response, NextFunction } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { config } from "../config";

const router = Router();

const favoriteProxy = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const proxyOptions: Options = {
    target: config.favoriteServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return path.replace(/^\/api\/favorite/, "");
    },
  };

  createProxyMiddleware(proxyOptions)(req, res, next);
};

router.post("/", authenticate, authorize(["write"]), favoriteProxy);
router.get("/:clientId", authenticate, authorize(["read"]), favoriteProxy);
router.delete("/:clientId", authenticate, authorize(["write"]), favoriteProxy);
router.delete(
  "/item/:favoriteId",
  authenticate,
  authorize(["write"]),
  favoriteProxy
);

export default router;
