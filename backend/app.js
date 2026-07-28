const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const livrosRoutes = require("./routes/livros");

app.use("/livros", livrosRoutes);

app.listen(3000);