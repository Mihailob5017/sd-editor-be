import express, { Router } from 'express';
import { DeleteAllUsers, GetAllUsers } from '../controllers/dev.controller';

const DevRouter: Router = express.Router();

DevRouter.get('/', GetAllUsers);
DevRouter.delete('/', DeleteAllUsers);

export { DevRouter };
