import rateLimiting from 'express-rate-limit';

//login limiter (strict)

export const loginLimiter = rateLimiting({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login requests per windowMs
    message:  {
        success: false,
        message: "Too many login attempts from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//general limiter (less strict)
export const apiLimiters = rateLimiting({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // limit each IP to 100 requests per windowMs
    message:  {
        success: false,
        message: "Too many requests from this IP, please try again after an hour"  
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const strictPasswordLimiter = rateLimiting({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 forget password requests per windowMs
    message:  {
        success: false,
        message: "Too many forget password attempts from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });