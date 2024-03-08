const express = require('express');
const session = require('express-session');
const cookies = require('cookie-parser');
const favicon = require('serve-favicon')
const path = require('path');

const app = express();
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

app.use(session({
	secret: "Secret!!",
	resave: false,
	saveUninitialized: false,
}));

app.use(cookies());

app.use(userLoggedMiddleware);

app.use(express.static(path.join(__dirname, 'public')));  
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/usersRoutes');
app.use('/', mainRoutes);
app.use('/user', userRoutes);


app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.path = req.path;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error404');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Escuchando servidor http://localhost:${port}`);
})