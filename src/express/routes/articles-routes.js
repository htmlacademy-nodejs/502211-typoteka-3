'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {ensureArray, prepareErrors} = require(`../../utils`);
const {getRandomInt, shuffle} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});
const articlesRouter = new Router();
const api = require(`../api`).getAPI();

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

const getViewArticleData = (articleId, comments) => {
  return api.getArticle(articleId, comments);
};

articlesRouter.get(`/category/:id`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles-by-category`, {categories})
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await getAddArticleData();
  res.render(`new-post`, {categories});
});

articlesRouter.post(`/add`,
  upload.single(`avatar`),
  async (req, res) => {
    const {body, file} = req;
    const categories = await api.getCategories();
    const articleData = {
      categories: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
      picture: file ? file.filename : body[`photo`],
      announce: body.announcement,
      full_text: body[`full-text`],
      title: body[`title`],
      createdAt: body.date,
    };

    try {
      await api.createArticle(articleData);
      res.redirect(`/my`);
    } catch (errors) {
      const validationMessages = prepareErrors(errors);
      const categories = await getAddArticleData();
      res.render(`new-post`, {article, categories, validationMessages});
    }
  }
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);
  res.render(`new-post`, {id, article, categories});
});

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : body[`photo`],
    announce: body.announcement,
    full_text: body[`full-text`],
    title: body[`title`],
    categories: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    createdAt: body.date,
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`new-post`, {id, article, categories, validationMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await getViewArticleData(id, true);
  res.render(`post-detail`, {article, id});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData(id, true);
    res.render(`post-detail`, {article, id, validationMessages});
  }
});

module.exports = articlesRouter;
