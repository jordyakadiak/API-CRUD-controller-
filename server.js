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
// Récupérer toutes les tâches
async function getAllTasks(req, res) {
  try {
    const [rows] = await dbConn.promise().query("SELECT * FROM todolist");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  } catch (err) {
    console.error(err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error:
          "Une erreur serveur s'est produite lors de la récupération de toutes les tâches.",
      })
    );
  }
}

// Récupérer une tâche spécifique
async function getTask(req, res, taskId) {
  try {
    const [rows] = await dbConn
      .promise()
      .execute("SELECT * FROM todolist WHERE id = ?", [taskId]);
    if (rows.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "La tâche demandée n'existe pas." }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    }
  } catch (err) {
    console.error(err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error:
          "Une erreur serveur s'est produite lors de la récupération de la tâche.",
      })
    );
  }
}

// Créer une nouvelle tâche
async function createTask(req, res) {
  try {
    let body = "";
    req.on("data", function (chunk) {
      body += chunk.toString();
    });
    req.on("end", async function () {
      const task = JSON.parse(body);
      const [result] = await dbConn
        .promise()
        .execute("INSERT INTO todolist (titre) VALUES (?)", [task.titre]);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ id: result.insertId, ...task }));
    });
  } catch (err) {
    console.error(err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error:
          "Une erreur serveur s'est produite lors de la création de la tâche.",
      })
    );
  }
}

// Mettre à jour une tâche existante
async function updateTask(req, res, taskId) {
  try {
    let body = "";
    req.on("data", function (chunk) {
      body += chunk.toString();
    });
    req.on("end", async function () {
      const task = JSON.parse(body);
      const [result] = await dbConn
        .promise()
        .execute("UPDATE todolist SET titre = ? WHERE id = ?", [
          task.titre,
          taskId,
        ]);
      if (result.affectedRows === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "La tâche à mettre à jour n'a pas été trouvée.",
          })
        );
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: taskId, ...task }));
      }
    });
  } catch (err) {
    console.error(err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error:
          "Une erreur serveur s'est produite lors de la mise à jour de la tâche.",
      })
    );
  }
}

// Supprimer une tâche spécifique
async function deleteTask(req, res, taskId) {
  try {
    const [result] = await dbConn
      .promise()
      .query("DELETE FROM todolist WHERE id = ?", [taskId]);
    if (result.affectedRows === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "La tâche demandée à supprimer n'a pas été trouvée.",
        })
      );
    } else {
      res.writeHead(204);
      res.end();
    }
  } catch (err) {
    console.error(err.message);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error:
          "Une erreur serveur s'est produite lors de la suppression de la tâche.",
      })
    );
  }
}
