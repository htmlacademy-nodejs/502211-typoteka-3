'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Разное`,
  `Кино`,
  `IT`,
  `Без рамки`,
  `Железо`,
  `Деревья`,
  `Музыка`,
  `Программирование`
];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockArticles = [
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Разное`,
      `Кино`,
      `IT`,
      `Без рамки`,
      `Программирование`
    ],
    "announce": `Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году.`,
    "full_text": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "title": `Ёлки. История деревьев`,
    "createdAt": `2021-11-30T06:01:00.888Z`,
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "user": `petrov@example.com`,
    "categories": [
      `Кино`,
      `Программирование`
    ],
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "full_text": `Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "title": `Ёлки. История деревьев`,
    "createdAt": `2020-10-22T09:39:29.445Z`,
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Совсем немного... Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты? Согласен с автором! Планируете записать видосик на эту тему?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `IT`,
      `Железо`,
      `Программирование`,
      `Кино`
    ],
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения.`,
    "full_text": `Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdAt": `2020-03-08T23:25:05.792Z`,
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-)`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Согласен с автором! Совсем немного... Хочу такую же футболку :-)`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы! Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "user": `petrov@example.com`,
    "categories": [
      `Кино`,
      `Без рамки`,
      `Деревья`,
      `Железо`,
      `Разное`,
      `Музыка`
    ],
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха.`,
    "full_text": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха.`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdAt": `2020-10-09T13:01:54.925Z`,
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Совсем немного...`
      },
      {
        "user": `petrov@example.com`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного... Согласен с автором!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Планируете записать видосик на эту тему? Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Деревья`,
      `Разное`,
      `Без рамки`,
      `Кино`,
      `Программирование`
    ],
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году.`,
    "full_text": `Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь.`,
    "title": `Ёлки. История деревьев`,
    "createdAt": `2021-07-10T11:38:17.785Z`,
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Согласен с автором!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());
beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  search(app, new DataService(mockDB));
});

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Ёлки`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`3 article found`, () => expect(response.body.length).toBe(3));
  test(`Article has correct title`, () => expect(response.body[0].title).toBe(`Ёлки. История деревьев`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
    .get(`/search`)
    .query({
      query: `Ничего интересного`
    })
    .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
);
