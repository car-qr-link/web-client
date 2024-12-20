# Веб-клиент

Веб-интерфейс пользователя для взаимодействия с приложением.

Имя пакета: `@car-qr-link/web-client`

## Используемые технологии, библиотеки

- [EJS](https://ejs.co)
- [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js)
- [NestJS](https://nestjs.com)
- [Pino](https://getpino.io)
- [Redis](https://redis.io)
- [Yandex SmartCaptcha](https://yandex.cloud/ru/docs/smartcaptcha/)

## Настройки

Для настройки используются переменные окружения:

| Название                   | Описание                                   | По умолчанию                                              |
| -------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| `DATABASE__URL`            | Адрес базы данных                          | `mariadb://web-client:web-client@mariadb:3306/web-client` |
| `ACCOUNTS__URL`            | Адрес сервиса учетных записей              | `http://accounts:3000`                                    |
| `STORAGE__URL`             | Адрес KV-хранилища (Redis)                 | `redis://localhost:6379/0`                                |
| `MESSAGING__BROKER_URL`    | Адрес брокера сообщений (Redis)            | `redis://localhost:6379/0`                                |
| `MESSAGING__QUEUE_PREFIX`  | Префикс очереди отправки сообщений         | `messages:send:`                                          |
| `NOTIFICATIONS__URL`       | Адрес сервиса уведомлений                  | `http://notifications:3000`                               |
| `NOTIFICATIONS__WAIT_TIME` | Время ожидания реакции водителя в секундах | `300`                                                     |
| `CAPTCHA__CLIENT_KEY`      | Ключ клиента Yandex SmartCaptcha           | **Обязателен**                                            |
| `CAPTCHA__SERVER_KEY`      | Ключ сервера Yandex SmartCaptcha           | **Обязателен**                                            |

## Входящие взаимодействия

Принимает HTTP-запросы для взаимодействия с пользователем. Используется формирование страниц на стороне сервера.

## Исходящие взаимодействия

Взаимодейтсвует со следующими сервисами:

- **Сервис учетных записей** - работа с учетными записями и QR-кодами
- **Сервис уведомлений** - отправка уведомлений водителям
- **Сервисы сообщений** - отправка кодов подтверждения при регистрации и иных чувствительных операциях
