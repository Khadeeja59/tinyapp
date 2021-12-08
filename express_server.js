const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8080; // default port 8080
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
  const templateVars = { urls: urlDatabase }; //value in template variable should be in obj form.
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
  res.render("urls_new");
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
  res.status(200).redirect(`/u/${shortURL}`); ///shorter version for our redirect links: /u/:shortURL
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
  const longURL = req.body.longURL;
  const templateVars = {shortURL,longURL};
  res.render("urls_show",templateVars);
 })
 app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;

  res.redirect('/urls');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
