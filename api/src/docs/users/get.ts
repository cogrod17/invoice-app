export const getUser = {
  tags: ["Users"],
  description: "User Get",
  parameters: [
    {
      in: "path",
      required: true,
      name: "user_id",
      schema: { type: "integer" },
    },
  ],
  responses: {
    200: {
      description: "User Info",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "number" },
              email: { type: "string" },
              firstname: { type: "string" },
              lastname: { type: "string" },
            },
          },
        },
      },
    },
  },
};
