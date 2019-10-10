const partners = ["amazecom", "wondertel"];

exports.up = function(knex) {
  return knex.schema
    .createTable("account", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.string("number").notNull();
      table.string("name").notNull();
    })
    .createTable("revocation", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table
        .integer("number")
        .unsigned()
        .notNull();
      table.datetime("date").notNull();
      table.enu("partner", partners);
    })
    .createTable("grant", table => {
      table
        .increments("id")
        .unsigned()
        .primary();
      table.integer("period").unsigned();
      table
        .integer("number")
        .unsigned()
        .notNull();
      table.datetime("date").notNull();
      table.enu("partner", partners);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("account")
    .dropTableIfExists("revocation")
    .dropTableIfExists("grant");
};
