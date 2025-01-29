const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController.js');
router.put('/updatePassword', UserController.updatePassword);
module.exports = router;
