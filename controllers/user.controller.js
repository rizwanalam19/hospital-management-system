import {
    User
} from "../models/user.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespose.js";
// import transporter from "../middleware/nodemail.middleware.js";
import jwt from "jsonwebtoken"
import nodemailer from  "nodemailer";
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password or app-specific password
    }
});

// const generateAccessTokenAndRefreshTokens = asynchandler(async (userId) => {
//     try {
//         // Attempt to find the user by ID
//         const user = await User.findById(userId);

//         // Check if user exists
//         if (!user) {
//             console.error('User not found for ID:', userId);
//             throw new ApiError(404, "User not found");
//         }

//         // Generate the access token
//         const accessToken = user.GenerateAccessToken();
//         // Generate the refresh token
//         const refreshToken = user.GenerateRefreshToken();

//         // Verify token generation
//         if (!accessToken || !refreshToken) {
//             console.error('Token generation failed for user ID:', userId);
//             throw new ApiError(500, "Failed to generate tokens");
//         }

//         //Save the refresh token
//         user.refreshToken = refreshToken;
//         await user.save({
//             validateBeforeSave: false
//         });


//         // Log before return
//         // console.log('Returning tokens from GenerateTokens:', {
//         //     accessToken,
//         //     refreshToken
//         // });
//         // Return the tokens
//         return [accessToken, refreshToken];


//     } catch (error) {
//         // Log the error for debugging
//         console.error('Error generating tokens:', error);
//         throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
//     }
// });




const CreateUser = asynchandler(async (req, res) => {
    const {
        username,
        email,
        fullName,
        role,
        password
    } = req.body;
    console.log(req.body);
    const userCreate = await User.create({
        username,
        email,
        fullName,
        role,
        password
    });

    const createUser = await User.findById(userCreate._id).select(" -password, -refreshToken")

    return res.status(200).json(new ApiResponse(200, createUser, "User create successfully !!!!"));

});

const LoginUser = asynchandler(async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const user = await User.findOne({
        username
    });

    if (!user) {
        console.error('User not found for username:', username); // Add this
        throw new ApiError(400, "No user found");
    }


    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        // console.error(error.message);
        throw new ApiError(400, " Password is not correct !!!!");
    }



    const refreshToken = await user.GenerateRefreshToken();
    const accessToken = await user.GenerateAccessToken();

    user.refreshToken = refreshToken ;
    await user.save({validateBeforeSave: false})
    if (!refreshToken) {
        console.error('Failed to receive tokens');
        throw new ApiError(500, "Failed to generate tokens");
    }
    if (!accessToken) {
        console.error('Failed to receive tokens');
        throw new ApiError(500, "Failed to generate tokens");
    }
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
                loggedInUser
            },
            "User Looged In Successfully "));
});

const ForgetPassword = asynchandler(async (req, res) => {
    const {
        email
    } = req.body;

    // Find the user by email
    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Generate a reset token
    const resetToken = await user.GenerateAccessToken();
    // console.log(resetToken);
    return res.status(200).json(new ApiResponse(200, {
        resetToken
    }, "Token Created successfully"))

    // Send email with reset token
    const resetLink = `http://yourwebsite.com/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please click on the following link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            throw new ApiError(500, "Error sending password reset email");
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({
                message: 'Password reset email sent successfully'
            });
        }
    });

});

const ResetPassword = asynchandler(async (req, res) => {
    const {
        token,
        newPassword
    } = req.body;


    console.log("Request Body:->", req.body);

    if (!token) {
        throw new ApiError(400, "Token is required");
    }
    console.log("Todays' date", Date.now());
    // Verify the token
    let decoded
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log("Decoded Token:", decoded);

    } catch (error) {
        console.error("JWT verification error:", error.message);
        throw new ApiError(400, "Invalid or expired token");
    }
    // Find the user by ID
    const user = await User.findById(decoded._id);
    console.log("User: - >", user);
    console.log("newPassword:=>", newPassword);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Ensure newPassword is valid
    if (!newPassword || newPassword.trim() === '') {

        throw new ApiError(400, "New password is required");
    }


    user.password = newPassword;

    await user.save({
        validateBeforeSave: false
    });

    res.status(200).json({
        message: 'Password reset successfully'
    });
});


const LogoutUser = asynchandler(async (req, res) => {
    console.log(req.user._id);

    await User.findByIdAndUpdate(
        req.user._id, {
            $unset: {
                refreshToken: 1,
            },
        }, {
            new: true
        })

    const options = {
        httpOnly: true,
        secure: true
    };
    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)

        .json(new ApiResponse(200, {}, "User logged out"))


});
const changePassword = asynchandler(async (req, res) => {
    try {
       const user = await User.findById(req.user._id);
       console.log(user);
       
        
        const { oldPassword, newPassword } = req.body;


        user.password = newPassword;



    await user.save({
        validateBeforeSave: false
    });

        return res
            .status(200)
            .json(new ApiResponse(200, user, "Successfully fetched the details"));
    } catch (error) {
        console.error(error.message)
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }
});


export {
    CreateUser,
    LoginUser,
    // generateAccessTokenAndRefreshTokens,
    LogoutUser,
    ForgetPassword,
    ResetPassword,
    changePassword
};