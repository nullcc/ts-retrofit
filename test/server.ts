import * as _ from 'lodash';
import express from 'express';
import bodyParser from 'body-parser';
import { User, API_PREFIX } from './fixtures';

export const app = express();

const users = [
  { id: 1, name: 'John', age: 20 },
  { id: 2, name: 'Peter', age: 32 },
  { id: 3, name: 'Smith', age: 45 }
];

class UserStore {
  private _users: User[];

  constructor(users: User[]) {
    this._users = users;
  }

  public findUserById(userId: number) {

  }

  get users(): User[] {
    return this._users;
  }
}

const jsonParser = bodyParser.json();

app.get('/api/v1/users', function(req, res) {
  res.status(200).json({});
});

app.post('/api/v1/users', jsonParser, function(req, res) {
  res.status(200).json({});
});

app.put('/api/v1/users/:userId', jsonParser, function(req, res) {
  res.status(200).json({});
});

app.patch('/api/v1/users/:userId', jsonParser, function(req, res) {
  res.status(200).json({});
});

app.delete('/api/v1/users/:userId', jsonParser, function(req, res) {
  res.status(200).json({});
});

app.head('/api/v1/users/:userId', jsonParser, function(req, res) {
  res.status(200).json({});
});

app.get('/api/v1/search', jsonParser, function(req, res) {
  res.status(200).json({});
});

// app.get('/users', function(req, res) {
//   res.status(200).json(users);
// });
//
// app.post('/users', jsonParser, function(req, res) {
//   const user = req.body;
//   const lastUser = _.last(users);
//   if (lastUser) {
//     user.id = lastUser.id + 1;
//   }
//   users.push(user);
//   res.status(200).json(user);
// });
//
// app.put('/users/:userId', jsonParser, function(req, res) {
//   const userId = parseInt(req.params.userId, 10);
//   const obj = req.body;
//   const index = _.findIndex(users, (user: any) => user.id === userId);
//   const user = Object.assign({} , { id: users[index].id }, obj);
//   users[index] = user;
//   res.status(200).json(user);
// });
//
// app.patch('/users/:userId', jsonParser, function(req, res) {
//   const userId = parseInt(req.params.userId, 10);
//   const obj = req.body;
//   const index = _.findIndex(users, (user: any) => user.id === userId);
//   const user = Object.assign({} , users[index], obj);
//   users[index] = user;
//   res.status(200).json(user);
// });
