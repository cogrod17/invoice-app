/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) =>
  pgm.sql(`
    CREATE TABLE recipients(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) DEFAULT '',
	email email NOT NULL,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	address1 TEXT DEFAULT NULL,
	state TEXT DEFAULT NULL,
	city TEXT DEFAULT NULL,
	zip TEXT DEFAULT NULL,
	phone TEXT DEFAULT NULL
);

CREATE TABLE drafts(
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	recipient_id INTEGER NOT NULL REFERENCES recipients(id) ON DELETE CASCADE
);

CREATE TABLE items (
	id SERIAL PRIMARY KEY,
	draft_id INTEGER NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
	title TEXT NOT NULL, 
	unit_cost NUMERIC(12,2) NOT NULL,
	quantity NUMERIC(12,2) NOT NULL
);

ALTER TABLE recipients ADD CONSTRAINT disallow_same_userid_with_recipient_email UNIQUE(email, user_id);
    `);

exports.down = (pgm) =>
  pgm.sql(`
    DROP TABLE items, recipients, drafts;
`);
