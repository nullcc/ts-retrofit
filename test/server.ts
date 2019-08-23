import express from "express";
import bodyParser from "body-parser";

export const app = express();

const jsonParser = bodyParser.json();

app.get("/api/v1/users", function(req, res) {
  res.status(200).json({});
});

app.get("/api/v1/users/:userId", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.post("/api/v1/users", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.put("/api/v1/users/:userId", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.patch("/api/v1/users/:userId", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.delete("/api/v1/users/:userId", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.head("/api/v1/users/:userId", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.options("/api/v1/users/:userId", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.get("/api/v1/search", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.post("/oauth2/authorize", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.get("/api/v1/posts", jsonParser, function(req, res) {
  res.status(200).json({});
});
