const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require("../config");
const ExpressError = require('../expressError');

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login',  async function(req, res, next){
    try{
        const {username, password } = req.body;
        if (await User.authenticate(username,password)){
            let token=jwt.sign({username}, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({token})

        } else{
            throw new ExpressError(`Invalid Credentials`, 400);}
    } catch(e) {
        next(e);
    }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async function(req, res, next){
    try{
        let {username} = await User.register(req.body);
        let token =jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({token});

    } catch(e) {
        next(e)
    }
    
})

module.exports = router;