//backend/src/middlewares/auth.mid.ts
// responsible for authenticating incoming requests by verifying a JSON Web Token (JWT) present in the access_token header

// Import the 'verify' function from the 'jsonwebtoken' library
import { verify } from "jsonwebtoken";
// Import the constant for HTTP_UNAUTHORIZED status code
import { HTTP_UNAUTHORIZED } from "../constants/http_status";

// Middleware function to authenticate incoming requests
export default (req: any, res: any, next: any) => {
    // Extract the JWT from the 'access_token' header of the request
    const token = req.headers.access_token as string;

    // If there's no token, send an unauthorized response
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).send();
    }

    try {
        // Verify the token using the JWT_SECRET from environment variables
        const decodedUser = verify(token, process.env.JWT_SECRET!);

        // // Log the decoded user
        // console.log('Decoded User:', decodedUser);

        // Attach the decoded user information to the request object
        req.user = decodedUser;

    } catch (error) {
        // If an error occurs during token verification, log the error and send an unauthorized response
        console.error('Error Verifying Token:', error);
        return res.status(HTTP_UNAUTHORIZED).send();
    }

    // If token verification is successful, proceed to the next middleware or route handler
    return next();
};

