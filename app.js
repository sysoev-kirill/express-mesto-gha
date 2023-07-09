const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const {
  ERROR_NOTFOUND
} = require('./error/constantsErrors');

const usersRoutes = require('./routes/users');
const сardsRoutes = require('./routes/cards');


//подключаемся к серверу mongo
// mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
//   family: 4
// });
mongoose.connect('mongodb://localhost:27017/mestodb', {
  family: 4,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64aaecf9784f93274eb7af32',
  }
  next();
});

app.use(express.json());
app.use(bodyParser.json());

app.use(usersRoutes);
app.use(сardsRoutes);


app.use((req, res, next) => {
  res.status(ERROR_NOTFOUND).send({ message: 'Что-то пошло не так...ошибка' })
})

app.listen(3000, () => {
  console.log('Сервер запущен')
})