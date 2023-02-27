import { Response } from "express";
import { TypedReqBody, DBQuery } from "../../types/global";
import db from "../../database";
import { signTokens } from "../../services";
import {
  UpdateUser,
  UserCredentials,
  UserRes,
  SetPasswordBody,
  UserFromDB,
} from "./types";

const validCredentials = (user: unknown): user is UserCredentials => {
  if (!user) return false;
  if (typeof user !== "object") return false;

  return (
    "email" in (user as UserCredentials) &&
    "password" in (user as UserCredentials)
  );
};
const login = async (
  req: TypedReqBody<UserCredentials>,
  res: Response<UserRes | Error | { detail: string }>
) => {
  if (!validCredentials(req.body)) return res.sendStatus(400);
  db.query(
    `SELECT id, email, firstname, lastname FROM users WHERE email = $1 AND password = crypt($2, password)`,
    [req.body.email, req.body.password],
    (error, { rows }) => {
      if (error) return res.status(400).send(error);
      const user = rows?.[0];
      if (!user) return res.status(400).send({ detail: "No user found" });

      const { access_token, refresh_token } = signTokens(user.id);
      user.access_token = access_token;
      user.refresh_token = refresh_token;

      res.status(200).send(user);
    }
  );
};

const createUser = async (req: TypedReqBody<UserCredentials>, res: Response) =>
  db.query(
    `INSERT INTO users(email, password) VALUES ($1::email, crypt($2, gen_salt('bf'))) RETURNING id, email, firstname, lastname`,
    [req.body.email, req.body.password],
    (error, { rows }) => {
      if (error) return res.status(400).send(error);

      const user: UserRes = rows[0];

      const { access_token, refresh_token } = signTokens(user.id);
      if (access_token && refresh_token) {
        user.access_token = access_token;
        user.refresh_token = refresh_token;
      } else
        return res.status(500).send({ detail: "could not generate tokens" });

      res.status(200).send(user);
    }
  );

const getUser: DBQuery = async (req, res) =>
  db.query(
    `SELECT id, email, firstname, lastname FROM users WHERE id = $1`,
    [req.params.id],
    (error, { rows }) => {
      if (error) return res.status(400).send(error);

      const user: UserFromDB = rows[0];
      if (!user) res.send(404);
      res.status(200).send(user);
    }
  );

const updateUser = async (req: TypedReqBody<UpdateUser>, res: Response) => {
  if (!req.user_id)
    return res.status(500).send({ detail: "Cannot find user id" });

  const { email, firstname, lastname } = req.body;

  db.query(
    "UPDATE users SET email = $1, firstname = $2, lastname = $3 WHERE id = $4 RETURNING id, email, firstname, lastname",
    [email, firstname, lastname, req.params.id],
    (error, { rows }) =>
      error
        ? res.status(400).send({ detail: "there was an error updating" })
        : res.status(200).send(rows[0])
  );
};

const deleteUser: DBQuery = async (req, res) => {
  if (req.user_id !== +req.params.id)
    return res.status(401).send({ detail: "cannot delete this user" });
  db.query(
    "DELETE FROM users WHERE id = $1",
    [req.params.id],
    (error, { rowCount }) => {
      error
        ? res.send(500)
        : rowCount > 0
        ? res.status(200).send({ detail: "user deleted" })
        : res.status(404).send({ detail: "No user found" });
    }
  );
};

const setPassword = async (
  req: TypedReqBody<SetPasswordBody>,
  res: Response
) => {
  if (req.user_id !== +req.params.id) return res.status(401).send();
  db.query(
    `UPDATE users SET password = crypt($1, gen_salt('bf')) WHERE password = crypt($2, password) AND id = $3`,
    [req.body.newPassword, req.body.oldPassword, req.params.id],
    (error, { rowCount }) => {
      error
        ? res.send(500)
        : rowCount > 0
        ? res.status(200).send({ detail: "password updated" })
        : res.status(404).send({ detail: "incorrect password" });
    }
  );
};

export const UserController = {
  getUser,
  createUser,
  login,
  updateUser,
  deleteUser,
  setPassword,
};
