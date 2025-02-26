import axios from "axios";
import UserModel from "../models/userModel.js";
import FormData from "form-data";


export const generateImage = async (req, res) => {

try {

    const {prompt,userId} = req.body;

    const user = await UserModel.findOne({_id:userId});
    if(!user || !prompt){
        return res.json({success:false, message: "misssing details"});
    }
    if(user.creditBalance < 1){
        return res.json({success:false, message: "Insufficient credits", creditBalance:user.creditBalance});
    }


    const form = new FormData()
    form.append('prompt', prompt)

    const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',form, {
    headers: {
        'x-api-key': process.env.CLIPDROP_API,
    },
    responseType: 'arraybuffer'
    
    })

    const base64 = Buffer.from(data, 'binary').toString('base64');
    const image = `data:image/png;base64,${base64}`

    await UserModel.findByIdAndUpdate(user._id, {creditBalance:user.creditBalance-1})

    res.json({success:true, message:"image generated",creditBalance:user.creditBalance-1, image});
    
} catch (error) {
    console.log(error);
    res.json({success:false, message: error.message });
    
}
    
}