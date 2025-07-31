import {rateLimit} from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 5, // Limit each IP to 5 requests per windowMs
    message: {error : 'Too many requests, please try again later.'},
})