import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
const PORT = 3000;

//important middlewares for backend setup
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: 'http//localhost:5173',
    Credentials: true
}
app.use(cors(corsOptions));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})