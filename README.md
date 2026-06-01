Состав команды: Щетко П.А., Карпов Р.Д., Чукаева С.М.

Финальная версия текущего проекта: все 5 дней, токены, сохранения, уведомления, финалы, сервер и ассеты.

## Установка

```bash
npm install
```

## Запуск проекта

Запустить клиент и сервер одной командой:

```bash
npm run dev
```

После запуска:

- клиент Vite: `http://localhost:5173/`
- сервер сохранений: `http://localhost:3001`
- проверка сервера: `http://localhost:3001/api/health`

## Запуск по отдельности

Только клиент:

```bash
npm run dev:client
```

Только сервер:

```bash
npm run dev:server
```

## Возможные ошибки при запуске

### `Permission denied` для `node_modules/.bin`

Пример ошибки:

```bash
sh: ./node_modules/.bin/concurrently: Permission denied
sh: ./node_modules/.bin/vite: Permission denied
```

Исправление:

```bash
chmod +x node_modules/.bin/*
npm run dev
```

### Предупреждение `nvm` про `.npmrc`

Пример предупреждения:

```bash
Your user's .npmrc file (${HOME}/.npmrc)
has a `globalconfig` and/or a `prefix` setting, which are incompatible with nvm.
```

Исправление:

```bash
nvm use --delete-prefix v22.22.2 --silent
```

После этого можно снова выполнить:

```bash
npm install
npm run dev
```

### `TypeError: Cannot read properties of undefined`

Если сервер пишет ошибку вида:

```bash
TypeError: Cannot read properties of undefined (reading '<playerId>')
```

значит файл сохранений поврежден или в нем нет поля `saves`. Самый простой способ сбросить локальные сохранения:

```bash
rm server/data/saves.json
npm run dev:server
```

Сервер создаст новый файл сохранений автоматически.
