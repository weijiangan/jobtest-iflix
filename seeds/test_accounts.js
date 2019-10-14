const accountsJson = require("../data/accounts.json");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("account")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("account").insert(accountsJson.users);
    });
};
