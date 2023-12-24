import __dirname from "../utils.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Doumentación Manuel Sosa Cardozo",
      description: "E-Commerce CoderHouse Backend",
    },
  },
  apis: [`${__dirname}/docs/**/*/*.yaml`],
};

export default swaggerOptions;