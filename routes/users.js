const router = require('express').Router();
const usersController = require('../controllers/usersController');


//router.route('/')
    //.get(verify,usersController.getUser)
    //.delete(verify,usersController.deleteUser);

router.route('/auth/register/')
    .post(usersController.register)

router.route('/auth/signin/')
    .post(usersController.signin)

/* router.route('/auth/token_verification')
    .post(usersController.verifyToken) */



module.exports = router;