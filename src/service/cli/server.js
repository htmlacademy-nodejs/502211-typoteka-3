'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const {HttpCode, API_PREFIX} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);
const {appApi, readMockData} = require(`../api`);
const logger = getLogger({name: `api`});

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

module.exports = {
  name: `--server`,
  run(args) {
    const app = express();
    app.use(express.json());

    app.get(`/articles`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (_err) {
        res.send([]);
      }
    });

    app.use(API_PREFIX, appApi);

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    readMockData();

    app.listen(port)
      .on("error", (err) => {
        logger.error(`An error occurred: ${err.message}`);
        process.exit(1);
      })
      .on("listening", () => {
        return logger.info(`Waiting for connections on a port ${port}`);
      });
  }
};
