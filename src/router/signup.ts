import express, { Router } from 'express';
import { SignUpController } from '../controllers/signup.controller';
import { LoginController } from '../controllers/login.controller';

const LoginRouter: Router = express.Router();

LoginRouter.post('/sign-up', SignUpController);

LoginRouter.post('/log-in', LoginController);

export { LoginRouter };
