import { Router } from "express";
const router = Router();

router.get("/user/:name", (req, res) => {
  const { name } = req.params;

  res.status(200).json({ name });
});

router.get("/user/:name/:age", (req, res) => {
  const { name, age } = req.params;
  res.status(200).json({ name, age });
});
