const amazecom = require("../data/amazecom.json");
const wondertel = require("../data/wondertel.json");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("grant")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("grant").insert([
        ...amazecom.grants.map(grant => ({
          ...grant,
          partner: "Amazecom"
        })),
        ...wondertel.grants.map(grant => ({
          ...grant,
          partner: "Wondertel"
        }))
      ]);
    });
};
