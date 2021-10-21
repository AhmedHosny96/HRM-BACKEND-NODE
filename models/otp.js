const mongoose = require("mongoose");

module.exports.Otp = mongoose.model(
  "Otp",
  mongoose.Schema(
    {
      email: {
        type: String,
        unique: true,
      },
      OTP: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
        index: { expires: 900 },
      },
    },
    { timestamps: true }
  )
);

//  const otpHolder = await Otp.find({
// email: req.body.email,
// });
// // if ot expired
// if (otpHolder.length === 0) res.status(400).send("Otp Expired");
// // confirm if otp is correct

// const rightOtp = otpHolder[otpHolder.length - 1]; // finds the last sent otp
// //compare the entered otp vs the right one in  the db
// await bcrypt.compare(req.body.otp, rightOtp.OTP);
//  if (rightOtp.email === req.body.email && validUser) {
// } else {
//   res.status(400).send("wrong OTP");
// }
