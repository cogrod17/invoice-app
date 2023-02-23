export const updateUser = {
  tags: ["Users"],
  description: "User update",
  parameters: [
    {
      in: "path",
      required: true,
      name: "user_id",
      schema: { type: "integer" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string" },
            firstname: { type: "string" },
            lastname: { type: "string" },
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
            },
          },
        },
      },
    },
  },
};
