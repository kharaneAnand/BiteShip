import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../middleware/trycatch.js";
import { AuthenticatedRequest } from "../middleware/isAUth.js";

export const loginUser = TryCatch(async (req, res) => {

    const { email, name, picture } = req.body;

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