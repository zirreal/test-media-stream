## Запуск демо

Прописываем команду -`npm install` для установки необходимых пакетов:

- [parcel](https://parceljs.org/) - для удобства сборки 🙈
- [whip-whep](https://www.npmjs.com/package/whip-whep) - для работы с OBS
- [obs-websocket-js](https://www.npmjs.com/package/obs-websocket-js) - для работы с OBS

### Конфиг

Для корректной работы необходимо правильно прописать конфиг -  `config.js`.

Готовый конфиг, скорее всего, будет отличаться от ваших настроек, поэтому стоит его проверить. 

### TrueConf

- В файле `api.js` расположены запросы к апи trueconf. Для правильной работы запросов необходимо создать файл **.env** c переменными `CONF_TOKEN` (токен доступа), OBS_WEBSOCKET (obs websocket), OBS_WS_PASS (obs websocket пароль)
Например: `CONF_TOKEN = 00abc00000x`, `OBS_WEBSOCKET=ws://127.0.0.1:4455`, `OBS_WS_PASS=11111111`


И потом запускаем командой -  `npm run start`

Если все правильно прописано и запущено, то должно все работать :)

