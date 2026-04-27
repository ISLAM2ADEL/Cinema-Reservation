import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cinema Reservation API",
      version: "1.0.0",
      description:
        "REST API for a Cinema Reservation system. Handles users, movies, halls, showtimes, seat booking, and Stripe payments.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token (from /api/v1/auth/login)",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Register & Login" },
      { name: "Users", description: "User management (Admin only)" },
      { name: "Movies", description: "Movie CRUD" },
      { name: "Halls", description: "Hall management" },
      { name: "Seats", description: "Seat availability" },
      { name: "Bookings", description: "Seat reservation" },
      { name: "Payments", description: "Stripe payment flow" },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Cinema API Docs",
    }),
  );
  console.log("Swagger docs → http://localhost:3000/api-docs");
};
