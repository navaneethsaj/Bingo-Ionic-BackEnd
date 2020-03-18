const express = require('express');
const router = express.Router();
const users = [{user: 'u1', password: 'u1'}, {user: 'u2', password: 'u2'}, {user: 'u3', password: 'u3'}];
router.get('', (req, res) => {
    res.send('auth server running');
});
router.post('/login', (req, res) => {
    const usercred = {user: req.body.user, password: req.body.password};
    if (isAuth(usercred)){
        res.send({status: 200, msg: 'auth success'})
    }else {
        res.send({status: 201, msg: 'wrong cred'})
    }
    function isAuth(){
        for (let u of users){
            if (u.user === usercred.user && u.password === usercred.password){
                return true
            }
        }
        return false;
    }
});

router.get('/logout', (req, res) => {
    res.send('Logout')
});

module.exports = router;
