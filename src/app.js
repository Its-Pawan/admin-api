import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { LIMIT } from "./constants.js"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,POST,PUT,PATCH ,DELETE,OPTIONS',
    credentials: true,
}))

app.use(express.json({ limit: LIMIT }))
app.use(express.urlencoded({ extended: true, limit: LIMIT }))
app.use(express.static("public"))
app.use(cookieParser())



// Routes import------>

import userRouter from './routes/user.routes.js'
import blogRouter from './routes/blog.routes.js'
import projectRouter from './routes/project.routes.js'
import socialLinksRouter from './routes/socialLinks.routes.js'
import profileRouter from './routes/profile.routes.js'
import versionRouter from './routes/version.routes.js'


// routes declaration
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f0f8ff;
                    color: #333;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    border: 2px solid #4caf50;
                    border-radius: 10px;
                    background-color: #fff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #4caf50;
                    margin-bottom: 10px;
                }
                a {
                    color: #1e90ff;
                    text-decoration: none;
                    font-weight: bold;
                }
                a:hover {
                    text-decoration: underline;
                }
                p {
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hello, I am Pawan</h1>
                <p>Connect with me on 
                    <a href="https://www.linkedin.com/in/info-pawan" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>!
                </p>
                <p>Origin: ${process.env.CORS_ORIGIN || "not set"}</p>
            </div>
        </body>
        </html>
    `);
});

app.use("/api/v1/users", userRouter)
app.use("/api/v1/blogs", blogRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/social-links", socialLinksRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/version", versionRouter)

// ex url => localhost:3000/api/v1/users/register 


export { app }