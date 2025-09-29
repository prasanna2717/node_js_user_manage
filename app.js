const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes") 
const cors = require("cors");
const { PORT } = require("./security");

dotenv.config();
connectDB();

const app = express();    

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
    