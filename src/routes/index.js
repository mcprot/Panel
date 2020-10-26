import {Router} from 'express';
let router = Router();

import api from './api';
import login from './login';
import register from './register';

router.use('/api', api);
router.use('/login', login);
router.use('/register', register);


import dashboard from './dashboard';
import billing from './billing';
import docs from './docs';
import proxy from './proxy';
import logout from './logout';

router.use('/dashboard', dashboard);
router.use('/billing', billing);
router.use('/docs', docs);
router.use('/proxy', proxy);
router.use('/logout', logout);

import admin from './admin';

router.use('/admin', admin);

export default router;
