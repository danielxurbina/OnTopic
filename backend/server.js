import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import stories from "./api/stories.route.js";

// Define the specification of the backend (description, title, etc.)
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "IT302-002 Project",
    version: "1.0.0",
    description: "This is a REST API application made with Express.js. It retreives data from MongoDB IT302 database",
    contact: {
      name: "Daniel Urbina",
      email: "du35@njit.edu",
    },
  },
  // List all the servers that would host this backend, for exmaple, your local development environment, a testing environment, production environment, etc.
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development Server",
    },
  ],
};

// List the additional files that all API routes in the backend
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [
    "./api/swaggerDefinitions/storySwagger.js",
    "./api/swaggerDefinitions/commentSwagger.js",
    "./api/swaggerDefinitions/userSwagger.js",
  ],
};

// Initialize the documentation with the defintions and options
const swaggerSpec = swaggerJSDoc(options);

// Load the environment variables from the .env file
dotenv.config();

const app = express();

// Only allow this documentation site if are in development environment (i.e. production/live website should not expose this documentation)
if (process.env.NODE_ENV === "development") {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

app.use(cors());
app.use(express.json());
app.use("/api/v1/du35/stories", stories);
app.use("*", (req, res) => {
  res.status(404).json({ error: "not found" });
});

export default app;