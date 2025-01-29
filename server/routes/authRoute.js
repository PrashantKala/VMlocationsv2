const express=require('express')
const router=express.Router()
const userAuth=require('../controller/authController.js')
router.post('/register', userAuth.registerUser);
router.post('/login', userAuth.loginUser);
router.get('/findUser', userAuth.findUser);
module.exports=router