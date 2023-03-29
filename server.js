// Charger les modules http et mysql
let http = require("http");
let mysql = require("mysql");

// Connectez-vous à la base de données
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jordy321",
  database: "todolist",
});

// Connecter à la base de données
dbConn.connect(function (err) {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");
});

// Créer un serveur
const server = http.createServer(function (req, res) {
  // GET /tasks : Récupérer toutes les tâches
  if (req.method === "GET" && req.url === "/tasks") {
    getAllTasks(req, res);
  }

  // GET /tasks/:id : Récupérer une tâche spécifique
  else if (req.method === "GET" && /^\/tasks\/\d+$/.test(req.url)) {
    const taskId = parseInt(req.url.split("/")[2]);
    getTask(req, res, taskId);
  }

  // POST /tasks : Créer une nouvelle tâche
  else if (req.method === "POST" && req.url === "/tasks") {
    createTask(req, res);
  }

  // PUT /tasks/:id : Mettre à jour une tâche existante
  else if (req.method === "PUT" && /^\/tasks\/\d+$/.test(req.url)) {
    const taskId = parseInt(req.url.split("/")[2]);
    updateTask(req, res, taskId);
  }

  // DELETE /tasks/:id : Supprimer une tâche spécifique
  else if (req.method === "DELETE" && /^\/tasks\/\d+$/.test(req.url)) {
    const taskId = parseInt(req.url.split("/")[2]);
    deleteTask(req, res, taskId);
  }

  // Sinon, renvoyer une erreur 404
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found\n");
  }
});

// Écouter le port 5500
server.listen(5500);

console.log("Le serveur est démarré sur le port 5500...");

// Récupérer toutes les tâches
function getAllTasks(req, res) {
  dbConn.query("SELECT * FROM todolist", function (err, results, fields) {
    if (err) throw err;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
  });
}

// Récupérer une tâche spécifique
function getTask(req, res, taskId) {
  dbConn.query(
    "SELECT * FROM todolist WHERE id = ?",
    [taskId],
    function (err, results, fields) {
      if (err) throw err;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  );
}

// Créer une nouvelle tâche
function createTask(req, res) {
  let body = "";
  req.on("data", function (chunk) {
    body += chunk.toString();
  });
  req.on("end", function () {
    const task = JSON.parse(body);
    dbConn.query(
      "INSERT INTO todolist (titre) VALUES (?)",
      [task.titre],
      function (err, results, fields) {
        if (err) throw err;
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: results.insertId, ...task }));
      }
    );
  });
}

// Mettre à jour une tâche existante
function updateTask(req, res, taskId) {
  let body = "";
  req.on("data", function (chunk) {
    body += chunk.toString();
  });
  req.on("end", function () {
    const task = JSON.parse(body);
    dbConn.query(
      "UPDATE todolist SET titre = ? WHERE id = ?",
      [task.titre, taskId],
      function (err, results, fields) {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: taskId, ...task }));
      }
    );
  });
}

// Supprimer une tâche spécifique
function deleteTask(req, res, taskId) {
  dbConn.query(
    "DELETE FROM todolist WHERE id = ?",
    [taskId],
    function (err, results, fields) {
      if (err) throw err;
      res.writeHead(204);
      res.end();
    }
  );
}

// En utilisant des promesses avec la syntaxe async/await

async function getData() {
  try {
    const result = await fetch('https://example.com/data');
    const data = await result.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

// En utilisant des fonctions asynchrones avec la syntaxe async

async function getData() {
  const result = await fetch('https://example.com/data');
  return result.json();
}

getData()
  .then(data => console.log(data))
  .catch(error => console.log(error));

  // Avec une réponse d'erreur HTTP

function getUser(id) {
  return new Promise((resolve, reject) => {
    if (typeof id !== 'number') {
      const error = new Error('Invalid user ID');
      error.statusCode = 400;
      return reject(error);
    }

    const user = await fetch(`/users/${id}`).then(res => res.json());

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return reject(error);
    }

    return resolve(user);
  });
}

// Avec l'instruction throw error

function getUser(id) {
  if (typeof id !== 'number') {
    throw new Error('Invalid user ID');
  }

  const user = await fetch(`/users/${id}`).then(res => res.json());

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

      async function getUsers() {
  // Obtenir les utilisateurs depuis la base de données
  return await User.getAll();
}

        async function getUser(id) {
  // Obtenir un utilisateur par son ID depuis la base de données
  const user = await User.getById(id);
  
  if (!user) {
    // S'il n'y a pas d'utilisateur avec cet ID, renvoyer une erreur HTTP
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  
  return user;
}

   module.exports = { getUsers, getUser };

   const UserService = require('./userService');

async function getUsers(req, res) {
  try {
    const users = await UserService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message);
  }
}

async function getUser(req, res) {
  try {
    const user = await UserService.getUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message);
  }
}

      module.exports = { getUsers, getUser };

      const express = require('express');
const UserController = require('./userController');

const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUser);

        module.exports = router;

        import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

 export default UserList;
