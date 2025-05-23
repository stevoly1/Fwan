
const jwtHelper = require("../utils/jwtTokenHelper");
const CustomError = require("../errors");
const Token = require("../models/tokenModel");

async function protect(req, res, next) {
    try {
        // put the header in a const in other to make the ternary expression short
        const header = req.headers.authorization;

        // check if the header has bearer only if header exist before split else set bearer token to null
        const bearerToken =
            header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;
        const cookiesToken = req.signedCookies;


        // conditional assigning accessToken base on availability
        const accessToken = bearerToken || cookiesToken.accessToken;
        const refreshToken = cookiesToken.refreshToken;



        // check if tokens are available
        if (!accessToken && !refreshToken) {
            throw new CustomError.UnauthenticatedError(
                "No authorization Tokens provided"
            );
        }


        // if access token available we validate and check the validity
        if (accessToken) {
            try {
                const { payload } = await jwtHelper.isTokenValid(accessToken);
                req.user = payload.user;
                console.log(req.user);
                return next();
            } catch (error) {
                if (error.name !== "TokenExpiredError") {
                    console.log(error)
                    throw new CustomError.UnauthenticatedError("invalid access token");
                }
            }
        }
       
        if (!refreshToken) {
            throw new CustomError.UnauthenticatedError("refresh token is missing");
        }

        const { payload } = await jwtHelper.isTokenValid(
            refreshToken
        );



        const storedToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken,
            isValid: true,
        });

        if (!storedToken) {
            throw new CustomError.UnauthenticatedError("refresh token revoked");
        }

        // rotate token with the stored db refreshToken and set new cookies
    
        await jwtHelper.addCookiesToResponse(
            res,
            { user: payload.user },
            storedToken.refreshToken,
        );

        req.user = payload.user;
        console.log(req.user);

        return next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    protect
};




// exports.authenticateUser = async (req, res, next) => {

//     try {

//         const { accessToken, refreshToken } = req.signedCookies;

//         if (accessToken) {
//             const payload = await jwtHelper.isTokenValid(accessToken);
//             req.user = payload.user;
//             return next();
//         }
//         if (!refreshToken) {
//             throw new CustomError.UnauthenticatedError("No tokens provided");
//         }
//         const payload = await jwtHelper.isTokenValid(refreshToken);

//         const existingToken = await Token.findOne({
//             user: payload.user.userId,
//             refreshToken: payload.refreshToken
//         });
//         if (!existingToken || !existingToken?.isValid) {
//             throw new CustomError.UnauthenticatedError('invalid authentication  please login')

//         }
//         await jwtHelper.addCookiesToResponse({
//             res,
//             user: payload.user,
//             refreshToken: existingToken.refreshToken,
//         });

//         req.user = payload.user;

//         next();

//     } catch (error) {

//         return next(new CustomError.UnauthenticatedError('Authentication Invalid'));
//     }

// };
