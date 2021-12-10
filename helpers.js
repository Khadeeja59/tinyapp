//-----------------------------------Function To generate a random string----------------------------------------------------------------------------------------//
const generateRandomString = (n) => {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};
//-----------------------------------Function To find user by email----------------------------------------------------------------------------------------//
const findUserByEmail = (email,userDb) => {
  for (let userId in userDb) {
    let user = userDb[userId];
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
};

//-----------------------------------Function To find the user's URL----------------------------------------------------------------------------------------//

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