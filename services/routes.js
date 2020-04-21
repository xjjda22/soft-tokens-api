const express = require('express');

// const authorization = require('./middlewares/authorization');
const healthCheck = require('./controllers/healthCheck');
const api = require('./controllers/api');

const router = express.Router();

// router.use(authorization);

router.get('/healthCheck', healthCheck.status);
router.get('/api', api.sampleApi);

module.exports = router;
