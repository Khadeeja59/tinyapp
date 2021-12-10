const { assert } = require('chai');

const { findUserByEmail } = require('../helpers.js');

const testUsers = {
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
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers)
    const expectedUser = testUsers.userRandomID;
    assert.equal(user, expectedUser);
  });
  it('should return undefined if the email is not in database', function() {
    const user = findUserByEmail("user11113@example.com", testUsers);
    const expectedUser = undefined;
    assert.equal(user, expectedUser);
  });
});
