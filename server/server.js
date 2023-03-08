import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/Error.middlewares.js';
import express from 'express';
import userRouter from './routes/Users.router.js';

const PORT = process.env.PORT || 5000;
const DELAY = 0;

dotenv.config();
const app = express();
app.use(cors());
// limit required use 3000md
app.use(bodyParser.json({ limit: '3000mb' }));
// connect DB
connectDB();

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('start server')
});

app.use('/api/users', userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});