'use strict';

const express = require(`express`);
const path = require(`path`);

const articlesRoutes = require(`./routes/articles-routes`);
const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);

const {getLogger} = require(`../service/lib/logger`);
const logger = getLogger({name: `api`});

const DEFAULT_PORT = 8080;

const app = express();

const PUBLIC_DIR = `public`;
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT)
  .on("error", (err) => {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(1);
  })
  .on("listening", () => {
    return logger.info(`Waiting for connections on a port ${DEFAULT_PORT}`);
  });
