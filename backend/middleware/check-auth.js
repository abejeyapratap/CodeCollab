const jwt = require("jsonwebtoken");

/**
 * Middleware to check authentication status based on JWT
 * Verifies if the JWT is valid based on "authorization" header
 */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // extract after "Bearer"

        // if invalid (AKA someone modified the JWT) -> throws error
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        /* req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId,
        }; */

        next();
    } catch (error) {
        // no token - not authenticated - unauthorized
        res.status(401).json({
            message: "You are not authenticated",
        });
    }
};
