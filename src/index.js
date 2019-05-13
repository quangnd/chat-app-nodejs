const express = require("express");
const path = require("path");
const chalk = require("chalk");

const app = express();
const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(chalk.blue("Server is up on PORT " + PORT));
});
