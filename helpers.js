function generateRandomString(n) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
 
  for ( let i = 0; i < n; i++ ) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
 }
 return randomString;
 }
const findUserByEmail = (email,userDb) => {  
  for(let userId in userDb) {    
     let user = userDb[userId]; 
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



module.exports = {generateRandomString, findUserByEmail, urlsForUser};