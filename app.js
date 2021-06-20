require('dotenv').config();

// init db
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
// const adapter = new FileSync('db.json');
// const db = low(adapter);
// db.defaults({ chats: [] }).write();

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const follow = {
  '-544553014': ['all']
}

bot.onText(/\/follow (.*)/, (msg, match) => {

  const chatId = msg.chat.id + '';
  follow[chatId] = follow[chatId] || [];

  if (!follow[chatId].includes('all') && !follow[chatId].includes(chatId)) follow[chatId].push(match[1]);
  bot.sendMessage(chatId, `ok`);
});


bot.on('polling_error', error => console.log(error))
bot.on('error', error => console.log(error))

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => res.send('Git bot is working!'))

app.post('/', (req, res) => {
  res.send('ok');

  console.log('POST: X-Gitlab-Token: ', req.header('X-Gitlab-Token'), 'body', JSON.stringify(req.body))
  const token = req.header('X-Gitlab-Token');
  if (!token) return;

  for (let chatId in follow) {
    if (follow[chatId].includes('all') || follow[chatId].includes(token)) {
      bot.sendMessage(chatId, `ok`);
    }
  }

})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => console.log('Git-bot started!'))
