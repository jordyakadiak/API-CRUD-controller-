let mysql = require("mysql"); 

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jordy321",
  database: "todolist",
});

function getAllTasks() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM todolist", function (err, results, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getTask(taskId) {
  return new Promise((resolve, reject) => {
    connection.execute("SELECT * FROM todolist WHERE id = ?", [taskId], function (
      err,
      rows,
      fields
    ) {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) {
          reject("La tâche demandée n'existe pas.");
        } else {
          resolve(rows[0]);
        }
      }
    });
  });
}

function createTask(task) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "INSERT INTO todolist (titre) VALUES (?)",
      [task.titre],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: result.insertId, ...task });
        }
      }
    );
  });
}

function updateTask(taskId, task) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "UPDATE todolist SET titre = ? WHERE id = ?",
      [task.titre, taskId],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          if (result.affectedRows === 0) {
            reject("La tâche à mettre à jour n'a pas été trouvée.");
          } else {
            resolve({ id: taskId, ...task });
          }
        }
      }
    );
  });
}

function deleteTask(taskId) {
  return new Promise((resolve, reject) => {
    connection.execute(
      "DELETE FROM todolist WHERE id = ?",
      [taskId],
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          if (result.affectedRows === 0) {
            reject("La tâche demandée à supprimer n'a pas été trouvée.");
          } else {
            resolve();
          }
        }
      }
    );
  });
}

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
