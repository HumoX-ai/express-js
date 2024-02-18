import express from "express";
import { create } from "express-handlebars";
import AuthRouter from "./routes/auth.js";
import ProductsRouter from "./routes/products.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import flash from "connect-flash";
import session from "express-session";
import varMiddleware from "./middleware/var.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: true })
);
app.use(flash());
app.use(varMiddleware);
app.use(AuthRouter);
app.use(ProductsRouter);

const PORT = process.env.PORT || 3000;

mongoose.set("strictQuery", false);

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
}

main();

app.listen(3000, () => {
  console.log(`Server started on port ${PORT}`);
});
