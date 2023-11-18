const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.port ?? 4000;
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbconfig");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
dbConnect();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/products");

const { notFound, errorHandler } = require("./middlewares/errorHandler");

//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);

// swagger endpoint
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
