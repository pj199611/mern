const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/authRoutes.js", "./routes/products.js"];

swaggerAutogen(outputFile, endpointsFiles);
