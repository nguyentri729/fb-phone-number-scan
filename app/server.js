const express = require("./configs/express");
const db = require("./configs/db");

async function init() {
  await db.connectDatabase();
  await db.loadModelFiles();

  express.loadRoutes();
  express.loadExpress();
}

init();
