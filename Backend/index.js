import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";
import { tr } from "zod/v4/locales";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const DBURI = process.env.MONGODB_URL;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["content-Type", "Authorization"],
  })
);

// databse connection code
try {
  mongoose.connect(DBURI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

//routes
app.use(express.json());
app.use("/todo", todoRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
