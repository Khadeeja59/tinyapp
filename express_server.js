const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//-----------------------------------Generate a Random ShortURL---------------------------------------------------------
function generateRandomString(n) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for ( let i = 0; i < n; i++ ) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
 }
 return randomString;
}

const shortURL = generateRandomString(6);


app.get("/", (req, res) => {
  res.send("Hello!");
});

//-------------------------------------Adding other routes.-------------------------------------------------------------- 
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"] 
  }; //value in template variable should be in obj form.
  res.render("urls_index", templateVars);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//Adding a new routeHandler for /urls:shortURL
// app.get("/urls/:shortURL", (req, res) => {
//   const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}; //value in template variable should be in obj form.
//   res.render("urls_show", templateVars);
// });


//-----------------------------Adding a GET Route to Show the Form-----------------------------------------------------------------
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]
  }
  res.render("urls_new",templateVars);
});
//----------------------Adding a POST Route to Receive the Form Submission---------------------------------------
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");  // Respond with 'Ok' (we will replace this)
  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  // res.send(shortURL);       
  res.redirect(`/urls/${shortURL}`); ///shorter version for our redirect links: /u/:shortURL
  // res.status(200).send();
  
});
//-----------------------Redirect after form submission-----------------------------------------------------------
app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  console.log(longURL);
  // const templateVars = {shortURL,longURL}
  // res.render("urls_show", templateVars);
  res.redirect(longURL);
});

//-----------------------------------Deleting URLs----------------------------------------------------------------------
app.post('/urls/:shortURL/delete', (req, res) => {

  console.log("DELETE HERE");

  // extract the id from the url
  // req.params
  const shortURL = req.params.shortURL;
  // delete it from the db
  delete urlDatabase[shortURL];

  // redirect to /quotes
  res.redirect('/urls');

});
//---------------------------------Updating URLS-----------------------------------------------------------
 app.get('/urls/:shortURL',(req,res)=>{
  const shortURL = req.params.shortURL;
  //const longURL = req.body.longURL;
  const longURL = urlDatabase[shortURL];
  const username = req.cookies["username"]
  const templateVars = {shortURL,longURL,username};
  res.render("urls_show",templateVars);
 })
 app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;

  res.redirect('/urls');

});
//----------------------------The login form (Cookies in Express)----------------------------------------------
app.get('/login',(req,res)=>{
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
    // ... any other vars
  };
  res.render("urls_index", templateVars);
  
});

app.post('/login', (req,res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
 });


 app.post('/logout', (req,res) => {
  res.clearCookie('username');
  res.redirect('/urls');
 });



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
