import { Router, Request, Response, NextFunction } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { config } from "../config";

const router = Router();

const clientProxy = (req: Request, res: Response, next: NextFunction): void => {
  const proxyOptions: Options = {
    target: config.clientServiceUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      return path.replace(/^\/api\/client/, "");
    },
  };

  createProxyMiddleware(proxyOptions)(req, res, next);
};

router.post("/", authenticate, authorize(["write"]), clientProxy);
router.get("/:id", authenticate, authorize(["read"]), clientProxy);
router.put("/:id", authenticate, authorize(["write"]), clientProxy);
router.delete("/:id", authenticate, authorize(["write"]), clientProxy);

export default router;
