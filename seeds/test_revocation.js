const amazecom = require("../data/amazecom.json");
const wondertel = require("../data/wondertel.json");

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("revocation")
    .del()
    .then(() => {
      // Inserts seed entries
      return knex("revocation").insert([
        ...amazecom.revocations.map(revocation => ({
          ...revocation,
          partner: "Amazecom"
        })),
        ...wondertel.revocations.map(revocation => ({
          ...revocation,
          partner: "Wondertel"
        }))
      ]);
    });
};
