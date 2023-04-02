const server = require("./router");

const PORT = 5500;

server.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}...`);
});