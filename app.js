const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimiter = require('express-rate-limit')

const connectDB = require("./config/db");

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser(process.env.JWT_SECRET));





// import routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

// import error handler middleware
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
// app.use("/api/v1/produce");
// app.use("/api/v1/offers");




app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // connectDB
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
