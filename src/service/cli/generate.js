'use strict';

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const randomDate = () => {
  let date = new Date(+new Date(2019, 0, 1) + Math.random() * (new Date() - new Date(2019, 0, 1)));
  let hour = 0 + Math.random() * (23 - 0) | 0;
  date.setHours(hour);
  return date;
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, categories, sentences, comments) => (
  Array.from({length: count}, () => ({
    id: nanoid(MAX_ID_LENGTH),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: randomDate(),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticles(countArticle, titles, categories, sentences, comments));

    if (countArticle > MAX_COUNT) {
      console.error(chalk.red(`???? ???????????? 1000 ????????????????????`));
      process.exit(ExitCode.FAIL);
    }

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.FAIL);
    }
  }
};
