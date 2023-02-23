export const userLogin = {
  tags: ["Users"],
  description: "User Login",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "A users info",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "number" },
              email: { type: "string" },
              firstname: { type: "string" },
              lastname: { type: "string" },
              access_token: { type: "string" },
              refresh_token: { type: "string" },
            },
          },
        },
      },
    },
  },
};
