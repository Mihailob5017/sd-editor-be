import express, { Request, Response } from 'express';
import { RedisClient } from './helpers/contants';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { LoginRouter } from './router/signup';
import { DevRouter } from './router/dev.router';
import cors from 'cors';

// Config
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
	app.use(cors());
	app.use(bodyParser.json({ limit: '30mb' }));
	app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

	app.get('/', (_req: Request, res: Response): void => {
		res.send('hi');
	});
	await RedisClient.connect();
	RedisClient.on('error', (err) => console.log('Redis Client Error', err));

	const devPath: string = process.env.SECRET_ROUTE || '';
	app.use('/auth', LoginRouter);
	app.use(devPath, DevRouter);

	app.listen(PORT, () => {
		console.log('server running');
	});
};

startServer();
