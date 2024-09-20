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
    res.send(`Hello World! Origin: ${process.env.CORS_ORIGIN}`);
});
app.use("/api/v1/users", userRouter)
app.use("/api/v1/blogs", blogRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/social-links", socialLinksRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/version", versionRouter)

// ex url => localhost:3000/api/v1/users/register 


export { app }