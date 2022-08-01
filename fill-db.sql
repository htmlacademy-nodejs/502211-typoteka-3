
-- добавили пользователей
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');

-- добавили категории
INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

-- временно отключим проверку всех ограничений в таблице
ALTER TABLE articles DISABLE TRIGGER ALL;
-- добавили публикации
INSERT INTO articles(title, announce, full_text, picture, user_id, created_at) VALUES
('Борьба с прокрастинацией', 'Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году.', 'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов.', 'item13.jpg', 2, '01.10.2021 07:36:15'),
('Как начать программировать', 'Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина.', 'Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов.', 'item04.jpg', 1, '12.00.2019 20:03:03'),
('Ёлки. История деревьев', 'Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.', 'Вы можете достичь всего. Стоит только немного постараться и запастись книгами.', 'item10.jpg', 1, '29.10.2020 11:49:00'),
('Самый лучший музыкальный альбом этого года', 'Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов.', 'Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Собрать камни бесконечности легко, если вы прирожденный герой. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов.', 'item03.jpg', 2, '16.09.2020 10:58:49'),
('Как начать программировать', 'Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Программировать не настолько сложно, как об этом говорят. Собрать камни бесконечности легко, если вы прирожденный герой.', 'Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Простые ежедневные упражнения помогут достичь успеха.', 'item13.jpg', 2, '17.01.2020 06:38:52');
-- после завершения операции вставки, включим обратно
ALTER TABLE articles ENABLE TRIGGER ALL;

-- присвоения категорий публикациям
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
(1, 5),
(1, 7),
(1, 3),
(2, 5),
(3, 7),
(3, 5),
(4, 1),
(4, 1),
(4, 5),
(4, 2),
(5, 3),
(5, 5),
(5, 6);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

-- добавили комментарии
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
('Хочу такую же футболку :-)', 2, 1),
('Плюсую, но слишком много буквы! Совсем немного...', 2, 2),
('Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 1, 2),
('Хочу такую же футболку :-) Это где ж такие красоты?', 2, 2),
('Это где ж такие красоты? Планируете записать видосик на эту тему? Совсем немного...', 2, 2),
('Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)', 2, 3),
('Мне кажется или я уже читал это где-то?', 1, 3),
('Плюсую, но слишком много буквы! Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 1, 3),
('Это где ж такие красоты?', 2, 3),
('Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы!', 2, 4),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?', 1, 4),
('Это где ж такие красоты? Хочу такую же футболку :-)', 1, 5);
ALTER TABLE comments ENABLE TRIGGER ALL;
