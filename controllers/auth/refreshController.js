// const Joi = require("joi");
// const RefreshToken = require("../../models/refreshToken");
// const CustomErrorHandler = require("../../services/CustomErrorHandler");
// const JwtService = require("../../services/JwtService");
// const { REFRESH_SECRET } = require("../../config");
// const User = require("../../models/user");

// const refreshController = {
//   async refresh(req, res, next) {
//     const refreshSchema = Joi.object({
//       refresh_token: Joi.string().required(),
//     });
//     const { error } = refreshSchema.validate(req.body);
//     if (error) {
//       return next(error);
//     }
//     let refreshToken;
//     //database check token
//     try {
//       refreshToken = await RefreshToken.findOne({
//         token: req.body.refresh_token,
//       });
//       if (!refreshToken) {
//         return next(CustomErrorHandler.unAuthorized("inValid Login!"));
//       }
//       let userId;
//       try {
//         const { _id } = await JwtService.verify(
//           refreshToken.token,
//           REFRESH_SECRET
//         );
//         userId = _id;
//       } catch (err) {
//         return next(CustomErrorHandler.unAuthorized("inValid Login!"));
//       }
//       const user = User.findOne({ _id: userId });
//       if (!user) {
//         return next(CustomErrorHandler.unAuthorized("No user Found!"));
//       }

//       var access_token = JwtService.sign({ _id: user._id, role: user.role });
//       var refresh_token = JwtService.sign(
//         { _id: user._id, role: user.role },
//         "1y",
//         REFRESH_SECRET
//       );
//       //database whitelist
//       await RefreshToken.create({ token: refresh_token });
//       res.status(200).json({ access_token, refresh_token });
//     } catch (err) {
//       return next(new Error("something went wrong " + err.message));
//     }
//   },
// };

// module.exports = refreshController;
