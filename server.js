let mysql = require("mysql");

// Connect to database
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jordy321",
  database: "todolist",
});

// Get all tasks
async function getAllTasks() {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM todolist");
    return rows;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// Get a specific task
async function getTask(taskId) {
  try {
    const [rows] = await connection
      .promise()
      .execute("SELECT * FROM todolist WHERE id = ?", [taskId]);
    if (rows.length === 0) {
      throw new Error("La tâche demandée n'existe pas.");
    }
    return rows[0];
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// Create a task
async function createTask(task) {
  try {
    const [result] = await connection
      .promise()
      .execute("INSERT INTO todolist (titre) VALUES (?)", [task.titre]);
    return { id: result.insertId, ...task };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// Update a task
async function updateTask(taskId, task) {
  try {
    const [result] = await connection
      .promise()
      .execute("UPDATE todolist SET titre = ? WHERE id = ?", [
        task.titre,
        taskId,
      ]);
    if (result.affectedRows === 0) {
      throw new Error("La tâche à mettre à jour n'a pas été trouvée.");
    }
    return { id: taskId, ...task };
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

// Delete a task
async function deleteTask(taskId) {
  try {
    const [result] = await connection
      .promise()
      .query("DELETE FROM todolist WHERE id = ?", [taskId]);
    if (result.affectedRows === 0) {
      throw new Error("La tâche demandée à supprimer n'a pas été trouvée.");
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
