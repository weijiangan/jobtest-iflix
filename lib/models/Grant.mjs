import Objection from "objection";

export default class Grant extends Objection.Model {
  static get tableName() {
    return "grant";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["number", "date", "partner"],
      properties: {
        id: { type: "integer" },
        number: { type: "string", pattern: "^\\d{10,11}$" },
        date: { type: "string" },
        partner: { type: "string" },
        period: { type: "integer" }
      }
    };
  }
}
