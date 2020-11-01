import {Router} from 'express';
import {userMiddleware} from '../middleware';
import api from './api';
import login from './login';
import register from './register';
import root from './root';
import dashboard from './dashboard';
import billing from './billing';
import docs from './docs';
import proxy from './proxy';
import admin from './admin';

let router = Router();
router.use('/api', api);
router.use('/login', login);
router.use('/register', register);

router.use(userMiddleware.injectUser)

router.use('/', root);
router.use('/dashboard', dashboard);
router.use('/billing', billing);
router.use('/docs', docs);
router.use('/proxy', proxy);

router.use('/admin', admin);

export default router;
