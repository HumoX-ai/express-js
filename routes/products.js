import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Shop | HumoX", token: true });
});

router.get("/product", (req, res) => {
  res.render("product", {
    title: "Products | HumoX",
  });
});

router.get("/add", (req, res) => {
  res.render("add", {
    title: "Add | HumoX",
  });
});

export default router;
