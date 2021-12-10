const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
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
    password: bcrypt.hashSync("purple-monkey-dinosaur",salt)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk",salt)
  }
}

const findUserByEmail = (email) => {  
   for(let userId in users) {    
      let user = users[userId]; 
      if(user.email === email) {
        return user;
      }
    }
    return null; 
};

const urlsForUser = (id, urlDatabase) => {
  const userURLs = {};
  for (let url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
};

function generateRandomString(n) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for ( let i = 0; i < n; i++ ) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
 }
 return randomString;
}

const shortURL = generateRandomString(6);

//-------------------------------------Adding other routes.--------------------------------------------------------------//
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];    
  const urls = urlsForUser (userId, urlDatabase);
  console.log("USERS" , users);
  const templateVars = { 
    urls: urls,
    user: users[userId]
    //  user: users
  }; 
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


//-----------------------------Adding a GET Route to Show the Form-----------------------------------------------------------------
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]; 
  if (!userId) {
    res.redirect("/login");
  } else {
  const templateVars = {      
    user:users[userId]
  }
  res.render("urls_new",templateVars);
}
});

//-------------------------------- Adding a new routeHandler for /urls:shortURL----------------------------------------------------

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL] && urlDatabase[shortURL].longURL; 
  const userId = req.cookies["user_id"];
  const urlsUser = urlDatabase[shortURL] && urlDatabase[shortURL].userID === userId;

  if(!userId){
    return res.status(400).send("Please login or Register!!!");
  }
  else if(!urlsUser){
    return res.status(400).send("No URL found for the user!");
  }
  else if (urlDatabase[shortURL].userID === userId) {
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

// app.post('/urls/:shortURL', (req, res) => {
//     const shortURL = req.params.shortURL;
//     const longURL = req.body.longURL;
//     urlDatabase[shortURL].longURL = longURL;
  
//     res.redirect('/urls');
  
//   });
 

//----------------------Adding a POST Route to Receive the Form Submission---------------------------------------
app.post("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {longURL ,userID:userId}
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`); ///shorter version for our redirect links: /u/:shortURL
 
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
  const userId = req.cookies["user_id"];
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === userId) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("Not permitted to delete URL");
  }
});
// --------------------------------/urls/:shortURL-------------------------------------------------------------------//
 app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;

  res.redirect('/urls');

});
//-------------------------------------Registration Page------------------------------------------------------//
app.get('/register',(req,res)=>{
  const newId = req.cookies["user_id"]  
  if(newId) {
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

  if (newEmail === "" || newPassword ==="") {
    return res.status(400).send("Your email and passwords cannot be empty");
  }
  const user = findUserByEmail(newEmail);
  if(user) {
    return res.status(400).send("The email already exists");
  }
  res.cookie('user_id', newId);
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
  const newId = req.cookies["user_id"];
  if(newId) {
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
  //const newId = generateRandomString(6);
  const user = findUserByEmail(newEmail);
  
  if(!user) {
    return res.status(400).send("Your email does not exist");  
  }

  else if (bcrypt.compareSync(newPassword, user.password)) {
      // req.cookies["user_id"];
      res.cookie('user_id', user.id);
      res.redirect('/urls');
      }

  else {
    return res.status(400).send("Wrong password");
  } 
});
 

//--------------------------------------Logout----------------------------------------------------------//

 app.post('/logout', (req,res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
 });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});