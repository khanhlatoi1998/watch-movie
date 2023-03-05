import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const PORT = process.env.PORT || 5000;
const DELAY = 0;

const app = express();
app.use(cors());
// limit required use 3000md
app.use(bodyParser.json({ limit: '3000mb' }));

app.get('/', (req, res) => {
    res.send('start server')
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});