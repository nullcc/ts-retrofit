import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { posts } from "./fixtures";

export const app = express();

const jsonParser = bodyParser.json();
const upload = multer();
app.use(bodyParser.urlencoded({ extended: false }));

const sleep = async (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};

app.get("/posts/just-string", jsonParser, function (req, res) {
  res.status(200).send("just string");
});

app.post("/posts/body-as-array", jsonParser, function (req, res) {
  res.status(201).json(req.body);
});

app.get("/posts/not-found", jsonParser, function (req, res) {
  res.status(404).send({});
});

app.get("/posts", jsonParser, function (req, res) {
  res.status(200).json(posts);
});

app.post("/posts", jsonParser, function (req, res) {
  res.status(201).json(req.body);
});

app.get("/posts/:id", jsonParser, function (req, res) {
  res.status(200).json(posts.find((p) => p.id === Number(req.params["id"])));
});

app.put("/posts/:id", jsonParser, function (req, res) {
  const found = posts.find((p) => p.id === Number(req.params["id"]));
  res.status(200).json({ ...found, ...req.body });
});

app.patch("/posts/:id", jsonParser, function (req, res) {
  const found = posts.find((p) => p.id === Number(req.params["id"]));
  res.status(200).json({ ...found, ...req.body });
});

app.delete("/posts/:id", jsonParser, function (req, res) {
  res.status(200).json(posts.find((p) => p.id === Number(req.params["id"])));
});

app.head("/posts/:id", jsonParser, function (req, res) {
  res.status(200).json(posts.find((p) => p.id === Number(req.params["id"])));
});
app.options("/posts/:id", jsonParser, function (req, res) {
  res.status(204).json(posts.find((p) => p.id === Number(req.params["id"])));
});
///////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/api/v1/form-url-encoded", jsonParser, function (req, res) {
  res.status(200).json(req.body);
});

app.post("/api/v1/upload", upload.any(), function (req, res) {
  res.status(200).json({});
});

app.get("/api/v1/file", upload.any(), function (req, res) {
  res.status(200).json({});
});

app.post("/api/v1/sms", jsonParser, function (req, res) {
  res.status(200).json({});
});

app.get("/api/v1/sleep-5000", async function (req, res) {
  await sleep(5000);
  res.status(200).json({});
});

app.get("/ping", async function (req, res) {
  res.status(200).json({ result: "pong" });
});
