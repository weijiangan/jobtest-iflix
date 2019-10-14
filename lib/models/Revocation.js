const Objection = require("objection");

module.exports = class Revocation extends Objection.Model {
  static get tableName() {
    return "revocation";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["number", "date", "partner"],
      properties: {
        id: { type: "integer" },
        number: { type: "string", pattern: "^\\d{11}$" },
        date: { type: "string" },
        partner: { type: "string" }
      }
    };
  }
};
