const express = require('express');
const router = new express.Router();
const {authenticateJWT, ensureCorrectUser, ensureLoggedIn} = require('../middleware/auth')
const Message = require('../models/message');


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureCorrectUser, async function(req,res, next){
    try{
        const {id} = req.params;
        const message = await Message.get(id);
        return res.json({message})

    } catch(e){
        next(e)
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/post-mesage', ensureLoggedIn, async function(req, res, next){
    try{
        const {to_username, body} = req.body;
        let message = await Message.create(to_username, body);
        return res.json({message})
    } catch(e){
        next(e)
    }
} )



/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureCorrectUser, async function(req, res, next){
    try{
        const {id} = req.params;
        let markMessageRead = await Message.markRead(id);
        return res.json({markMessageRead})
        
    } catch(e){
        next(e)
    }
} )

module.exports = router;