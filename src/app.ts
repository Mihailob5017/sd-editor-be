import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { LoginRouter } from './router/signup';
import cors from 'cors';

// Config
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.get('/', (_req: Request, res: Response): void => {
	res.send('hi');
});

app.use('/auth', LoginRouter);

app.listen(PORT, () => {
	console.log('server running');
});
