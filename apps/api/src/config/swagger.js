import swaggerJsdoc from "swagger-jsdoc";

function createSwaggerSpec() {
  return swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "CIT API",
        version: "1.0.0",
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
  });
}

const swaggerSpec = createSwaggerSpec();

export { swaggerSpec };
