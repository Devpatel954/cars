import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userid) => {
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not set in environment');
    }
    const payload = { id: userid };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 8) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(user._id.toString());

        res.json({success:true,token});


        
    } catch (error) {

        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
        
    }
}

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;   
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id.toString());
        res.json({ success: true, token });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getuserdata = async(req,res)=>{

    try {
        
        const{user} = req;

        res.json({success:true,data:user});


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
        
    }
}

