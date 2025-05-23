const jwt = require('jsonwebtoken');



const createAccessJWT = ({payload}) => {
  return jwt.sign(
    { payload }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_JWT_EXPIRES_IN || "15m"}
  );
};

const createRefreshJWT = ({payload}) => {
  return jwt.sign(
    {  payload },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_JWT_EXPIRES_IN || "30d"}
  );
};
const isTokenValid = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const addCookiesToResponse = async (res, {user}, refreshToken) => {
  const accessTokenJWT = createAccessJWT({ payload:  {user}  });
const refreshTokenJWT = createRefreshJWT({ payload:{user, refreshToken} } );

  const In15Mins = 15 * 60 * 1000;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + In15Mins),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
  return { accessTokenJWT, refreshTokenJWT };
};


module.exports = {
  createAccessJWT,
  createRefreshJWT,
  isTokenValid,
  addCookiesToResponse,
};