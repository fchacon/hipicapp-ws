'use strict';
// import express from 'express';
import User from '../api/user/dao/user-dao';
import express from 'express';

// Passport Configuration
require('./local/passport').setup(User);
// require('./facebook/passport').setup(User, config);
// require('./google/passport').setup(User, config);
// require('./twitter/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local').default);
// router.use('/facebook', require('./facebook').default);
// router.use('/twitter', require('./twitter').default);
// router.use('/google', require('./google').default);

export default router;
