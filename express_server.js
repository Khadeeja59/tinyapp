const express = require("express");
const app = express();

//4. Body parser for POST request(using this as the data in body is sent as buffer)
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8080; // default port 8080
//Added ejs template engine
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//6. Generate a Random ShortURL
function generateRandomString(n) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for ( let i = 0; i < n; i++ ) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
 }
 return randomString;
}




// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// // 1. Adding a new routeHandler for /urls and use res.render() to pass the URL data to our template. 
// app.get("/urls", (req, res) => {
//   const templateVars = { urls: urlDatabase }; //value in template variable should be in obj form.
//   res.render("urls_index", templateVars);
// });

// // 2.Adding a new routeHandler for /urls:shortURL, :=>shortURL is a route parameter , its value will be available in req.params obj. 
// app.get("/urls/:shortURL", (req, res) => {
//   const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]/* What goes here? */ }; //value in template variable should be in obj form.
//   res.render("urls_show", templateVars);
// });
// 3. Adding a GET Route to Show the Form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
// 5. Adding a POST Route to Receive the Form Submission
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });