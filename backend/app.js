const express = require("express");
const app = express();
const mongoose = require("./database/db");
const dotenv = require("dotenv");

const List = require("./database/models/list");
const Task = require("./database/models/task");
const User = require("./database/models/user");
const jwt = require("jsonwebtoken");
app.use(express.json());

dotenv.config();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept, x-access-token, x-refresh-token"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );
  next();
});

// check whether the request has valid JWT access token
let authenticate = (req, res, next) => {
  let token = req.header("x-access-token");

  // verify JWT
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) {
      res.status(401).send(err);
    } else {
      req.user_id = decoded._id;
      next();
    }
  });
};

let verifySession = (req, res, next) => {
  let refreshToken = req.header("x-refresh-token");
  let _id = req.header("_id");

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          error:
            "User not found. Make sure that the refresh token and user id are correct",
        });
      }

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) {
        next();
      } else {
        return Promise.reject({
          error: "Refresh token has expired or the session is invalid",
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

app.get("/lists", authenticate, (req, res) => {
  List.find({ _userId: req.user_id })
    .then((lists) => res.send(lists))
    .catch((err) => console.log(err));
});

app.post("/lists", authenticate, (req, res) => {
  new List({ title: req.body.title, _userId: req.user_id })
    .save()
    .then((list) => res.send(list));
});

app.get("/lists/:listId", (req, res) => {
  List.find({ _id: req.params.listId })
    .then((lists) => res.send(lists))
    .catch((err) => console.log(err));
});

app.patch("/lists/:listId", authenticate, (req, res) => {
  List.findOneAndUpdate(
    { _id: req.params.listId, _userId: req.user_id },
    { $set: req.body }
  )
    .then((lists) => res.send(lists))
    .catch((err) => console.log(err));
});

app.delete("/lists/:listId", authenticate, (req, res) => {
  const deleteTasks = (list) => {
    Task.deleteMany({ _listId: list._id })
      .then(() => list)
      .catch((err) => console.log(err));
  };
  List.findByIdAndDelete({ _id: req.params.listId, _userId: req.user_id })
    .then((lists) => res.send(deleteTasks(lists)))
    .catch((err) => console.log(err));
});

app.get("/lists/:listId/tasks/", authenticate, (req, res) => {
  Task.find({ _listId: req.params.listId })
    .then((tasks) => res.send(tasks))
    .catch((err) => console.log(err));
});

app.post("/lists/:listId/tasks/", authenticate, (req, res) => {
  List.findOne({ _id: req.params.listId, _userId: req.user_id })
    .then((user) => {
      if (user) {
        return true;
      }
      return false;
    })
    .then((canCreateTask) => {
      if (canCreateTask) {
        let newTask = new Task({
          title: req.body.title,
          _listId: req.params.listId,
        });
        newTask.save().then((newTaskObj) => {
          res.send(newTaskObj);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

app.get("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOne({ _listId: req.params.listId, _id: req.params.taskId })
    .then((task) => res.send(task))
    .catch((err) => console.log(err));
});

app.patch("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        return true;
      }
      return false;
    })
    .then((canUpdateTasks) => {
      if (canUpdateTasks) {
        Task.findOneAndUpdate(
          {
            _id: req.params.taskId,
            _listId: req.params.listId,
          },
          {
            $set: req.body,
          }
        ).then(() => {
          res.send({ message: "Updated Successfully!" });
        });
      } else {
        res.sendStatus(404);
      }
    });
});

app.delete("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        return true;
      }
      return false;
    })
    .then((canDeleteTasks) => {
      if (canDeleteTasks) {
        Task.findOneAndRemove({
          _id: req.params.taskId,
          _listId: req.params.listId,
        }).then((removedTaskDoc) => {
          res.send(removedTaskDoc);
        });
      } else {
        res.sendStatus(404);
      }
    });
});

/* USER ROUTES */

/**
 * POST /users
 */
app.post("/users", (req, res) => {
  let body = req.body;
  let newUser = new User(body);

  newUser
    .save()
    .then(() => {
      return newUser.createSession();
    })
    .then((refreshToken) => {
      return newUser.generateAccessAuthToken().then((accessToken) => {
        return { accessToken, refreshToken };
      });
    })
    .then((authTokens) => {
      res
        .header("x-refresh-token", authTokens.refreshToken)
        .header("x-access-token", authTokens.accessToken)
        .send(newUser);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

/**
 * POST /users/login
 */
app.post("/users/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findByCredentials(email, password)
    .then((user) => {
      return user
        .createSession()
        .then((refreshToken) => {
          return user.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          res
            .header("x-refresh-token", authTokens.refreshToken)
            .header("x-access-token", authTokens.accessToken)
            .send(user);
        });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

/**
 * GET /users/me/access-token
 */
app.get("/users/me/access-token", verifySession, (req, res) => {
  req.userObject
    .generateAccessAuthToken()
    .then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.listen(3000, () => console.log("Server connected on port 3000!"));
