export const deleteUser = {
  tags: ["Users"],
  description: "User delete",
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
      description: "confirm message",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              detail: { type: "string" },
            },
          },
        },
      },
    },
    404: {
      description: "confirm message",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              detail: { type: "string" },
            },
          },
        },
      },
    },
  },
};
