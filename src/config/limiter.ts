import { rateLimit, RateLimitRequestHandler } from "express-rate-limit";

export const limiter = (petitionLimit: number): RateLimitRequestHandler =>
  rateLimit({
    windowMs: 60 * 1000,
    limit: petitionLimit,
    handler: (req, res) => {
      const r = req as typeof req & { rateLimit?: { resetTime?: Date } };

      const retryAfter = r.rateLimit?.resetTime
        ? Math.ceil((r.rateLimit.resetTime.getTime() - Date.now()) / 1000) : 60;

      return res.status(429).json({
        success: false,
        message: `Demasiadas solicitudes, intenta de nuevo en (${retryAfter}) segundos ⏳`,
      });
    },
  });
