const http = require("http");
const url = require("url");
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("./service");

const server = http.createServer(function (req, res) {
  const reqUrl = url.parse(req.url, true);
  const regex = /^\/tasks\/(\d+)$/;
  const taskId = reqUrl.pathname.match(regex) ? parseInt(reqUrl.pathname.match(regex)[1]) : null;

  if (req.method === "GET" && reqUrl.pathname === "/tasks") {
    getAllTasks()
      .then((results) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      })
      .catch((err) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Une erreur serveur s'est produite lors de la récupération de toutes les tâches",
          })
        );
      });
  } else if (req.method === "GET" && taskId !== null) {
    getTask(taskId)
      .then((task) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(task));
      })
      .catch((err) => {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err }));
      });
  } else if (req.method === "POST" && reqUrl.pathname === "/tasks") {
    let body = "";
    req.on("data", function (chunk) {
      body += chunk.toString();
    });
    req.on("end", async function () {
      try {
        const task = JSON.parse(body);
        const createdTask = await createTask(task);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(createdTask));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Une erreur serveur s'est produite lors de la création de la tâche.",
          })
        );
      }
    });
  } else if (req.method === "PUT" && taskId !== null) {
    let body = "";
    req.on("data", function (chunk) {
      body += chunk.toString();
    });
    req.on("end", async function () {
      try {
        const task = JSON.parse(body);
        const updatedTask = await updateTask(taskId, task);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedTask));
      } catch (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err }));
      }
    });
  } else if (req.method === "DELETE" && taskId !== null) {
    deleteTask(taskId)
      .then(() => {
        res.writeHead(204);
        res.end();
      })
      .catch((err) => {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err }));
      });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found\n");
  }
});

module.exports = server;