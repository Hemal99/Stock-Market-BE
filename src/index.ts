const express = require("express");
const { App } = require("./services/ExpressApp");

const { dbConnection } = require("./services/Database");

const StartServer = async () => {
  const app = express();

  await dbConnection();

  await App(app);

  app.listen(process.env.PORT, () => {
    console.log(`Listening to port  ${process.env.PORT}`);
  });
};

StartServer();
