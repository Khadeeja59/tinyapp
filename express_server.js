const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const PORT = 8080; // default port 8080
const {generateRandomString, findUserByEmail, urlsForUser} = require("./helpers");

app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser())
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: 'session',
    keys: [
      'b10783d2-24ed-4a30-9b84-9c10ea429bfd',
      'f56a87b1-5588-4f8a-beb0-3e1b06aa40e2',
    ],
  })
);
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};
let users = { 
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur",salt)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk",salt)
  }
};

//-------------------------------------Adding routes.--------------------------------------------------------------//
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls", (req, res) => {
  const userId = req.session.user_id;   
  const urls = urlsForUser(userId, urlDatabase);
  console.log("USERS" , users);
  const templateVars = {
    urls: urls,
    user: users[userId]
  }; 
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//-----------------------------Adding a GET Route to Show the Form-----------------------------------------------------------------//
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id; 
  if (!userId) {
    res.redirect("/login");
  } else {
    const templateVars = {
      user:users[userId]
    };
    res.render("urls_new",templateVars);
  }
});

//--------------------Adding a routeHandler for /urls:shortURL--------------------------------------------------------//

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL] && urlDatabase[shortURL].longURL; 
  const userId = req.session.user_id;
  const urlsUser = urlDatabase[shortURL] && urlDatabase[shortURL].userID === userId;

  if (!userId) {
    return res.status(400).send("Please login or Register!!!");
  }  else if (!urlsUser) {
    return res.status(400).send("No URL found for the user!");
  } else if (urlDatabase[shortURL].userID === userId) {
    const templateVars = {
      shortURL: shortURL,
      longURL: longURL,
      user:users[userId]
    };
    res.render("urls_show", templateVars);
  } else if (urlDatabase[shortURL].userID !== userId) {
    res.status(403).send("This is not your URL");
  }
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect('/urls');
});

//----------------------Adding a POST Route to Receive the Form Submission---------------------------------------//
app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL ,userID:userId};
  res.redirect(`/urls`); ///${shortURL} 
});


app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL] && urlDatabase[shortURL].longURL; 
  res.redirect(longURL);
});

//-----------------------------------Deleting URLs----------------------------------------------------------------------//
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === userId) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("Not permitted to delete URL");
  }
});

//-------------------------------------Registration Page------------------------------------------------------//
app.get('/register',(req,res)=>{
  const newId = req.session.user_id; 
  if (newId) {
    res.redirect("/urls");
    return;
  }
  const templateVars = {
    user: null,
  };
  res.render("register", templateVars);
});

app.post('/register', (req,res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const newId = generateRandomString(6);
  if (newEmail === "" || newPassword === "") {
    return res.status(400).send("Your email and passwords cannot be empty");
  }
  const user = findUserByEmail(newEmail, users);
  if (user) {
    return res.status(400).send("The email already exists");
  }
  req.session.user_id = newId;
  users[newId] =  {
    id: newId,
    email: newEmail,
    password: bcrypt.hashSync(newPassword, salt)
  };
  console.log(users);
  res.redirect('/urls');
});

//--------------------------------------Login Page-----------------------------------------------------------//
app.get('/login', (req,res) => {
  const newId = req.session.user_id;
  if (newId) {
    res.redirect("/urls");
    return;
  }
  //const templateVars = {user: null,};
  const templateVars = {user: null,};
  res.render("login", templateVars);
});

app.post('/login', (req,res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const user = findUserByEmail(newEmail, users);
  
  if (!user) {
    return res.status(400).send("Your email does not exist");
  } else if (bcrypt.compareSync(newPassword, user.password)) {
    req.session.user_id = user.id;
    res.redirect('/urls');
  } else {
    return res.status(400).send("Wrong password");
  } 
});
 
//--------------------------------------Logout----------------------------------------------------------//

app.post('/logout', (req,res) => {
  req.session = null;
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});