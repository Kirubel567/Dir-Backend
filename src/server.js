import {connectDB} from "./config/db.js";
import app from "./app.js";
import dotenv from 'dotenv' 

dotenv.config(); 

const PORT = process.env.PORT || 5000;

// Connect to the database 
connectDB(); 


// Listening the server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
