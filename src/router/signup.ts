import express, { Router } from 'express';
import { SignUpController } from '../controllers/signup.controller';

const LoginRouter: Router = express.Router();

LoginRouter.post('/sign-up', SignUpController);

export { LoginRouter };
