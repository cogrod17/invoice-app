export const setPassword = {
  tags: ["Users"],
  description: "User reset password",
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
            oldPassword: { type: "string" },
            newPassword: { type: "string" },
          },
        },
      },
    },
  },
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
