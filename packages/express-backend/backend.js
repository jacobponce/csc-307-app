// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;
const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
    return users["users_list"].filter(
      (user) => user["name"] === name
    );
  };

const findUserByJob = (job) => {
    return users["users_list"].filter(
        (user) => user["job"] === job
    );
};

const findUserByJobAndName = (name, job) => {
  return users["users_list"].filter(
      (user) => user["job"] === job && user["name"] === name
  );
};

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name && job) {
      let result = findUserByJobAndName(name, job);
      result = { users_list: result };
      res.send(result);
    } 
    else if (name){
      let result = findUserByName(name);
      result = { users_list: result };
      res.send(result);
    }
    else if (job){
      let result = findUserByJob(job);
      result = { users_list: result };
      res.send(result);
    }
    else {
      res.send(users);
    }
  });

 
// This helper function makes it easier to refactor and edit later on.
const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id); // find gets the first occurrence of unique identifier
  
app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

function deleteUserById(id) {
    users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);
}

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        deleteUserById(id);
        res.status(204).send(`User with id: ${id} deleted`);
    }
});

const addUser = (user) => {
    user.id = Math.random().toString() // create random id
    users["users_list"].push(user);
    return user;
  };
  
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.status(201).send(userToAdd);
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});