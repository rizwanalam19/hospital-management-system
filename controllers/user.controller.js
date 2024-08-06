import {
    User
} from "../models/user.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespose.js";

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
        password
    } = req.body;
    console.log(req.body);
    const userCreate = await User.create({
        username,
        email,
        fullName,
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
        throw ApiError(400, " Password is not correct !!!!");
    }


   
    const refreshToken = await user.GenerateRefreshToken();
    const accessToken = await user.GenerateAccessToken();
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

const LogoutUser = asynchandler( async(req, res)=>{
    console.log(req.User);
    
await User.LogoutUser(
    req.user._id,
     {  $unset: {
    refreshToken: 1,
  },}, {new: true} )

  const options = {
    httpOnly: true,
    secure: true
  };
  res 
  .status(200)
  .clearCookie("accessToken", accessToken)
  .clearCookie("refreshToken", refreshToken)
  .json(new ApiResponse(200, {}, "User logged out"))

  
});

export {
    CreateUser,
    LoginUser,
    // generateAccessTokenAndRefreshTokens,
    LogoutUser
};