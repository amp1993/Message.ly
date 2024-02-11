const express = require("express");
const User = require('../models/user');
const router = new express.Router();
const {ensureLoggedIn, ensureCorrectUser} = require('../middleware/auth')

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async function(req, res, next){
    try{
        let users = await User.all();
        return res.json({users});
    }catch (e){
        next (e)
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async function (req, res, next){
    try{
        let user = await User.get(req.params);
        return res.json({user})
    } catch(e){
        next(e);
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async function(req, res, next){
    try{
        let userMessagesTo = await User.messagesTo(req.params.username)
        return res.json({userMessagesTo});
    } catch(e) {
        next(e)
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async function(req, res,next){
    try{
        let userMessagesFrom = await User.messagesFrom(req.params.username);
        return res.json({userMessagesFrom});
    } catch(e) {
        next(e)
    }
})

module.exports = router;