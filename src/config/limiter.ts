import {rateLimit} from 'express-rate-limit';

export const limiter = (petitionLimit: number) =>
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: petitionLimit, // Limit each IP to petitionLimit requests per windowMs
    message: { error: 'Too many requests, please try again later...' }
  });
