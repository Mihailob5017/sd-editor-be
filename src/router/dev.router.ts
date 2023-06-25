import express, { Router } from 'express';
import {
	DeleteAllUsers,
	GetAllUsers,
	SetToken,
	GetToken,
} from '../controllers/dev.controller';

const DevRouter: Router = express.Router();

DevRouter.get('/', GetAllUsers);
DevRouter.delete('/', DeleteAllUsers);
DevRouter.post('/set-redis', SetToken);
DevRouter.post('/get-redis', GetToken);

export { DevRouter };
