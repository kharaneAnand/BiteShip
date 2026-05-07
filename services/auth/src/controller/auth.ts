import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../middleware/trycatch.js";
import { AuthenticatedRequest } from "../middleware/isAUth.js";
import { Oauth2client } from "../config/googleConfig.js";
import axios from "axios";

export const loginUser = TryCatch(async (req, res) => {
    const {code} = req.body ;

    if(!code){
        return res.status(400).json({
            message : "Authorization code is required" ,
        });
    }

    const googleRes = await Oauth2client.getToken(code)
    Oauth2client.setCredentials(googleRes.tokens)

    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);

    const { email, name, picture } = userRes.data ;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }

    const token = jwt.sign(
        { user },
        process.env.JWT_SEC as string,
        {
            expiresIn: "15d",
        }
    );

    res.status(200).json({
        message: "Login Success",
        token,
        user,
    });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {

    const user = req.user;

    res.json(user);

});