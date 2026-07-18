import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CIT API",
      version: "0.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
    components: {
      securitySchemes: {
        sessionCookie: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
        },
      },
    },
  },
  apis: ["./src/routes/api/v1/*.js"],
};

const openapiSpec = swaggerJsdoc(options);

export { openapiSpec };
