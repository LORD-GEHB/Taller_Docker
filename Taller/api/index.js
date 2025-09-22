const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const connection = mysql.createConnection({
  host: "mysql_taller",
  user: "root",
  password: "taller",
  database: "taller",
});
connection.connect();
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
const port = 3001;
app.use(cors(corsOptions));
app.use(express.json());

//Create usuario
app.post("/usuario", (req, res) => {
  const body = req.body;
  console.log(body);
  const query = `INSERT INTO usuarios(nombre, edad, correo, carnet) VALUES ('${body.nombre}',${body.edad},'${body.correo}','${body.carnet}')`;

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

//Read usuarios
app.get("/usuarios", (req, res) => {
  connection.query(
    "SELECT nombre, edad, correo, carnet FROM usuarios;",
    function (error, results, fields) {
      if (error) throw error;
      res.json(results);
    }
  );
});

//Update usuario
app.put("/usuario", (req, res) => {
  const nombre = req.body.nombre;
  const edad = req.body.edad;
  const correo = req.body.correo;
  const carnet = req.body.carnet;

  const query = `UPDATE usuarios SET nombre='${nombre}', edad=${edad}, correo='${correo}' WHERE carnet=${carnet}`;

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

//Delete usuario
app.delete("/usuario", (req, res) => {
  const carnet = req.body.carnet;

  const query = `DELETE FROM usuarios WHERE carnet = ${carnet}`;

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port);
});