const User = require('../models/User');

module.exports = {
    async store(req, res) {
        const {email} = req.body;
        
        if ( email == undefined || email.length == 0 ){
            return res.status(400).json({ error: 'Invalid E-mail'})
        }

        let user = await User.findOne({ email });

        if (! user){
            user = await User.create({ email });
        }

        return res.json(user);
    }
};