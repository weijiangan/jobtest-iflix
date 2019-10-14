const Objection = require("objection");

module.exports = class Account extends Objection.Model {
  static get tableName() {
    return "account";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["number", "name"],
      properties: {
        id: { type: "integer" },
        number: { type: "string", pattern: "^\\d{11}$" },
        name: { type: "string" }
      }
    };
  }
};
