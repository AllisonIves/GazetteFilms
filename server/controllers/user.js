const User = require('../models/user');
const generateToken = require('../utils/jwt');

// Register a User
exports.register = async(req, res) => {

    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password, filmCount:0 });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ message: 'User created successfully', token});

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// Login a User
exports.login = async (req, res) => {
    try {
        const { email, password} = req.body;
        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });  //use regEx to make email not case sensitive
        if(!user) 
            return res.status(400).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ message: 'User logged in successfully', username: user.username, token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        //respond with the list of users
        res.json(users);
    } catch (err) {
        //handle errors
        res.status(500).json({ message: err.message });
    }
};