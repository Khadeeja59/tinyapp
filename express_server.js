const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const PORT = 8080; // default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

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
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const findUserByEmail = (email) => {  
   for(let userId in users) {    
      let user = users[userId]; 
      if(user.email === email) {     
          return user;     
        }   
        }   return null; 
      }


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
  const userId = req.cookies["user_id"];    
  const templateVars = { 
    urls: urlDatabase, 
    user: users[userId]
    //  user: users
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
  const userId = req.cookies["user_id"]; 
  if (!userId) {
    res.redirect("/login");
  } else {
  const templateVars = { 
    //username: req.cookies["username"]
    //user: users
     
    user:users[userId]
  }
  res.render("urls_new",templateVars);
}
});
//----------------------Adding a POST Route to Receive the Form Submission---------------------------------------
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");  // Respond with 'Ok' (we will replace this)
  const userId = res.cookie(["user_id"]);

  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL ,userId}
  console.log(urlDatabase);
  // res.send(shortURL);       
  res.redirect(`/urls/${shortURL}`); ///shorter version for our redirect links: /u/:shortURL
  // res.status(200).send();
  
});
//-----------------------Redirect after form submission-----------------------------------------------------------
app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  console.log(longURL);
  // const templateVars = {shortURL,longURL}
  // res.render("urls_show", templateVars);
  res.redirect(longURL);
});

//-----------------------------------Deleting URLs----------------------------------------------------------------------
app.post('/urls/:shortURL/delete', (req, res) => {

  console.log("DELETE HERE");
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  // redirect to /quotes
  res.redirect('/urls');

});
//---------------------------------Updating URLS-----------------------------------------------------------
 app.get('/urls/:shortURL',(req,res)=>{
  const shortURL = req.params.shortURL;
  //const longURL = req.body.longURL;
  const newId = req.cookies["user_id"]; 

  const longURL = urlDatabase[shortURL].longURL;
  //const username = req.cookies["username"]
  const user = users[newId];
  const templateVars = {shortURL,longURL,user};
  res.render("urls_show",templateVars);
 })
 app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;

  res.redirect('/urls');

});
//----------------------------The login form (Cookies in Express)----------------------------------------------
// app.get('/login',(req,res)=>{
//   const templateVars = {
//     username: req.cookies["username"],
//     //urls: urlDatabase,
//     user: users
//     // ... any other vars
//   };
//   res.render("urls_index", templateVars);
  
// });

// app.post('/login', (req,res) => {
//   const username = req.body.username;
//   res.cookie('username', username);
//   res.redirect('/urls');
//  });
// //--------------------------------------Logout----------------------------------------------------------

//  app.post('/logout', (req,res) => {
//   res.clearCookie('username');
//   res.redirect('/urls');
//  });

//-------------------------------------Registration Page------------------------------------------------------
app.get('/register',(req,res)=>{
  const newId = req.cookies["user_id"]
   const templateVars = {
    user: users[newId],
  };
  res.render("register", templateVars);

});

app.post('/register', (req,res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const newId = generateRandomString(6);

  if (newEmail === "" || newPassword ==="") {
    return res.status(400).send("Your email and passwords cannot be empty");
  }
  const user = findUserByEmail(newEmail);
  { if(user) {
    return res.status(400).send("The email already exists");
  }}
  res.cookie('user_id', newId);
  users[newId] =  {
        id: newId,
        email: newEmail,
        password: newPassword
      };
      
      res.redirect('/urls');

 });

app.get('/login', (req,res) => {
  const newId = req.cookies["user_id"]
  const templateVars = {user: users[newId],};
  res.render("login", templateVars);
});

app.post('/login', (req,res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  //const newId = generateRandomString(6);
  const user = findUserByEmail(newEmail);
  if(!user) {
    return res.status(400).send("Your email does not exist");
  }
  if(user.password !== newPassword) {
    return res.status(400).send("Wrong password");
  }
    res.cookie('user_id', user.id);
    res.redirect('/urls');
});
// //--------------------------------------Logout----------------------------------------------------------

 app.post('/logout', (req,res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
 });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});