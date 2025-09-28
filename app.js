const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes") // ✅ Fixed casing
const cors = require("cors");
const { PORT } = require("./security");

dotenv.config();
connectDB();

const app = express();    

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://react-app-user-manage.vercel.app',    
}));

// Routes
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
    