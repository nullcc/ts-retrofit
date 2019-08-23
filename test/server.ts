import * as _ from "lodash";
import express from "express";
import bodyParser from "body-parser";
import { IUser, API_PREFIX } from "./fixtures";

export const app = express();

const users = [
  { id: 1, name: "John", age: 20 },
  { id: 2, name: "Peter", age: 32 },
  { id: 3, name: "Smith", age: 45 }
];

class UserStore {
  private _users: IUser[];

  constructor(users: IUser[]) {
    this._users = users;
  }

  public findUserById(userId: number) {

  }

  get users(): IUser[] {
    return this._users;
  }
}

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

app.get("/api/v1/search", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.post("/oauth2/authorize", jsonParser, function(req, res) {
  res.status(200).json({});
});

app.get("/api/v1/posts", jsonParser, function(req, res) {
  res.status(200).json({});
});
