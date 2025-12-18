import { connectDB } from "./config/db.js";
import app from "./app.js";
import dotenv from 'dotenv' 

dotenv.config(); 

const PORT = process.env.PORT || 3000;


connectDB(); 
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
