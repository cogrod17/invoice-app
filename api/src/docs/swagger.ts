import {
  userLogin,
  createUser,
  getUser,
  deleteUser,
  updateUser,
  setPassword,
} from "./users";

export const swaggerDocument = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "APIs Document",
    description: "Docs",
    termsOfService: "",
    // contact: {
    //   name: "Tran Son hoang",
    //   email: "son.hoang01@gmail.com",
    //   url: "https://hoangtran.co",
    // },
  },
  servers: [{ url: "http://localhost:1717", description: "local server" }],
  tags: [{ name: "Users" }, { name: "Invoices" }],
  paths: {
    "/user/login": { get: userLogin },
    "/user/create": { post: createUser },
    "/users/{user_id}": { get: getUser },
    "/users/update/{user_id}": { put: updateUser },
    "users/delete/{user_id}": { delete: deleteUser },
    "users/reset_password/{user_id}": { post: setPassword },
  },
};
