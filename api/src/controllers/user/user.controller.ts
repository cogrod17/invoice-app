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

const login = async (
  req: TypedReqBody<UserCredentials>,
  res: Response<UserRes | Error | { detail: string }>
) =>
  db.query(
    `SELECT id, email, firstname, lastname FROM users WHERE email = $1 AND password = crypt($2, password)`,
    [req.body.email, req.body.password],
    ({ rows }) => {
      const user = rows?.[0];
      if (!user) return res.status(404).send({ detail: "No user found" });

      const { access_token, refresh_token } = signTokens(user.id);
      user.access_token = access_token;
      user.refresh_token = refresh_token;

      res.status(200).send(user);
    },
    (error) => res.status(400).send(error)
  );

const createUser = async (req: TypedReqBody<UserCredentials>, res: Response) =>
  db.query(
    `INSERT INTO users(email, password) VALUES ($1::email, crypt($2, gen_salt('bf'))) RETURNING id, email, firstname, lastname`,
    [req.body.email, req.body.password],
    ({ rows }) => {
      const user: UserRes = rows[0];

      const { access_token, refresh_token } = signTokens(user.id);
      if (access_token && refresh_token) {
        user.access_token = access_token;
        user.refresh_token = refresh_token;
      } else
        return res.status(500).send({ detail: "could not generate tokens" });

      res.status(200).send(user);
    },
    (error) => res.status(400).send(error)
  );

const getUser: DBQuery = async (req, res) =>
  db.query(
    `SELECT id, email, firstname, lastname FROM users WHERE id = $1`,
    [req.params.id],
    ({ rows }) => {
      const user: UserFromDB = rows[0];
      if (!user) res.send(404);
      res.status(200).send(user);
    },
    (err) => res.status(400).send(err)
  );

const updateUser = async (req: TypedReqBody<UpdateUser>, res: Response) => {
  if (!req.user_id)
    return res.status(500).send({ detail: "Cannot find user id" });

  const { email, firstname, lastname } = req.body;

  db.query(
    "UPDATE users SET email = $1, firstname = $2, lastname = $3 WHERE id = $4 RETURNING id, email, firstname, lastname",
    [email, firstname, lastname, req.params.id],
    ({ rows }) => res.status(200).send(rows[0]),
    () => res.status(400).send({ detail: "there was an error updating" })
  );
};

const deleteUser: DBQuery = async (req, res) => {
  if (req.user_id !== +req.params.id)
    return res.status(401).send({ detail: "cannot delete this user" });
  db.query(
    "DELETE FROM users WHERE id = $1",
    [req.params.id],
    ({ rowCount }) => {
      rowCount > 0
        ? res.status(200).send({ detail: "user deleted" })
        : res.status(404).send({ detail: "No user found" });
    },
    () => res.send(500)
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
    ({ rowCount }) => {
      rowCount > 0
        ? res.status(200).send({ detail: "password updated" })
        : res.status(404).send({ detail: "incorrect password" });
    },
    () => res.send(500)
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