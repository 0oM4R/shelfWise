import cors from "cors";

const corsMiddleware = cors({
  // should be replaced with production
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export default corsMiddleware;
