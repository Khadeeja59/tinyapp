const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
//Added ejs template engine
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

// Adding a new routeHandler for /urls and use res.render() to pass the URL data to our template. 
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }; //value in template variable should be in obj form.
  res.render("urls_index", templateVars);
});

// Adding a new routeHandler for /urls:shortURL, :=>shortURL is a route parameter , its value will be available in req.params obj. 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]/* What goes here? */ }; //value in template variable should be in obj form.
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});