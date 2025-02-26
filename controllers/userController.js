
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({success:false, message: "All fields are required" });
        }

        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({success:false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash( password  , salt);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token  = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

        res.json({success:true, message: "User registered successfully", user:{name:user.name}, token });

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message });
    }


}



const loginUser  = async (req,res) => {

    const {email, password} = req.body;
    try{
        const user  = await UserModel.findOne({email})

        if(!user){
           return res.json({success:false,message:"User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success:false, message:"Invalid credentials"});
    }

    const token  = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

    res.json({success:true, message: "User logged in successfully", user:{name:user.name}, token });
}
    catch(error){
        console.log(error);
        res.json({success:false, message: error.message });
    }
}


const userCredits  = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.userId);
        
        res.json({success:true, user:{name:user.name} ,credits:user.creditBalance});
    
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message });
    }
}


export {registerUser, loginUser,userCredits}