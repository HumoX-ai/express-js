import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../services/token.service.js";
const router = Router();

router.get("/login", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/");
  }
  res.render("login", {
    title: "Login page",
    loginError: req.flash("loginError"),
  });
});

router.get("/register", (req, res) => {
  if (req.cookies.token) {
    return res.redirect("/");
  }
  res.render("register", {
    title: "Register page",
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");

  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("loginError", "All fields are required");
    return res.redirect("/login");
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    req.flash("loginError", "User does not exist");
    return res.redirect("/login");
  }

  const token = generateToken(existingUser._id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    req.flash("loginError", "Incorrect password");
    return res.redirect("/login");
  }

  res.redirect("/");
});
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.redirect("/register?registerError=true");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    req.flash("registerError", "Email already exists");
    return res.redirect("/register");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
  };
  const user = await User.create(userData);
  const token = generateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.redirect("/login");
});

export default router;
