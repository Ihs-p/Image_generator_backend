import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { config } from 'dotenv'
import connectDB from './config/mongodb.js'
import userRoutes from './routes/userRoutes.js'
import imageRoutes from './routes/imageRoutes.js'


const app = express()
const PORT = process.env.PORT || 5000
// config()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

await connectDB()


app.get('/', (req, res) => {
    res.send('api working ')
})  


app.use('/api/user',userRoutes)
app.use('/api/image',imageRoutes)

app.listen(PORT, () => {
    console.log(`server running  on port:${PORT}`)
})