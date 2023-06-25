import express, { Request, Response } from 'express';
import { RedisClient } from './helpers/contants';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { LoginRouter } from './router/signup';
import { DevRouter } from './router/dev.router';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

const PORT = process.env.PORT || 5000;

// Start the server
const startServer = async (): Promise<void> => {
	// Enable CORS
	app.use(cors());

	// Parse request bodies as JSON
	app.use(bodyParser.json({ limit: '30mb' }));

	// Parse URL-encoded bodies
	app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

	// Root route
	app.get('/', (_req: Request, res: Response): void => {
		res.send('hi');
	});

	// Connect to Redis
	await RedisClient.connect();
	RedisClient.on('error', (err) => console.log('Redis Client Error', err));

	// Configure routes
	const devPath: string = process.env.SECRET_ROUTE || '';
	app.use('/auth', LoginRouter);
	app.use(devPath, DevRouter);

	// Start listening on the specified port
	app.listen(PORT, () => {
		console.log('Server running');
	});
};

// Call the startServer function to start the server
startServer();
