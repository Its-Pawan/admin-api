import 'dotenv/config'
import { app } from './app.js';
import connectDB from "./db/index.js";

connectDB()
    .then(() => {
        const Port = process.env.PORT || 3000
        app.on("error", err => console.error("Samething went wrong with app !!!", err))
        app.listen(Port, () => console.log("Server is running at post: ", Port))
    })
    .catch(err => console.log("MongoDB connection failed !!!!", err))
