import express from 'express';
import bodyParser from 'body-parser';
import compression from "compression";
import cors from "cors";
import router from './components/app';
import {corsOptions} from './middlewares/cors';


export const app = express();
const port = process.env.PORT || 3030;

app.use(compression()); // compress all responses
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', router);

export const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});