/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email email NOT NULL, 
        firstname VARCHAR(50), 
        lastname VARCHAR(50), 
        password TEXT NOT NULL
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE users;
  `);
};
