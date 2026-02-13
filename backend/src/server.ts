import dotenv from "dotenv";
dotenv.config();

import app from "./app"
import "./dummy"
import connectDb from "./config/db"

const PORT = process.env.PORT || 5000;

connectDb();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});  