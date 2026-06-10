import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req,res) => {


    try{
         const {name,email,password} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
       const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json(user);
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

export const login = async (req,res) => {
     const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({ message: "No user Exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
}
