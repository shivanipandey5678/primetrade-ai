
import mongoose from "mongoose";

export async function init(){
try {
     await mongoose.connect(process.env.MONGODB_URL);
     console.log("mongoDB connected 💪!")
} catch (error) {
    console.error("issue while connecting DB",error);
    process.exit(1)
}
 
}

