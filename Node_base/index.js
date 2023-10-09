const express = require("express");
const exphbs = require("express-handlebars");
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQL = require('./modulos/mysql');
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
} = require("firebase/auth");

let id_chat_ = 1
const app = express();
app.use(express.static('/Node_base/public/js/Wordle.js'));


app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

const server = app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

const io = require('socket.io')(server);

const sessionMiddleware = session({
    secret: 'sararasthastka',
    resave: true,
    saveUnintialized: false,
});

app.use(sessionMiddleware);

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBbBacnVmohSvpL7n1AK6OxJhG_pZB4054",
  authDomain: "tp-final-g13.firebaseapp.com",
  projectId: "tp-final-g13",
  storageBucket: "tp-final-g13.appspot.com",
  messagingSenderId: "375941335450",
  appId: "1:375941335450:web:2f100de46dbbc658305223",
  measurementId: "G-E9Z91C8GM6"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

// Importar AuthService
const authService = require("./authService");


app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    let userCredential = await authService.registerUser(auth, { email, password });
    let id_contacto = userCredential.user.uid
    /*
    await MySQL.realizarQuery(`
        INSERT INTO MC_contactos (id_contacto, user_contacto, password_contacto )
        VALUES ("${id_contacto}", "${email}", "${password}"); `)*/
    res.render("login", {
      message: "Registro exitoso. Puedes iniciar sesión ahora.",
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.render("register", {
      message: "Error en el registro: " + error.message,
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await authService.loginUser(auth, {
      email,
      password,
    });
    req.session.Dato = req.body.email;
    console.log("usuario logueado: ", req.session.Dato);
    // Aquí puedes redirigir al usuario a la página que desees después del inicio de sesión exitoso

    res.redirect("/chat");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.render("login", {
      message: "Error en el inicio de sesión: " + error.message,
    });
  }
});

app.get("/chat", (req, res) => {
  // Agrega aquí la lógica para mostrar la página del menu
  //console.log("Email logueado: " , req.session.Dato)
  res.render("chat");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  console.log("sesion destruida");
  res.render("login");
});
