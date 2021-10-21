const express = require("express");
const Joi = require("joi-browser");
const path = require("path");
const router = express.Router();

const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, Validate } = require("../models/user");
const { Token } = require("../models/token");

const sendMail = require("../utils/sendMail");

router.use("/public", express.static(path.join(__dirname, "public")));

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const users = await User.findById(req.params.id);
  res.send(users);
});

// create new user

router.post("/", async (req, res) => {
  //validate inputs
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().min(10).email().required(),
    phone: Joi.number().required(),
    userRole: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check if user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already exists");
  // create user object by picking using lodash
  user = User(
    _.pick(req.body, ["name", "email", "password", "phone", "userRole"])
  );

  // generate the auth token
  let jwt = user.generateAuthToken();
  // create jwt token i

  let token = await Token.findOne({ id: user._id });
  if (!token) {
    token = await new Token({
      id: user._id,
      token: jwt,
    });
  }
  //  email link
  const emailLink = `${process.env.URL}/${user._id}/${jwt}`;

  // send the email
  sendMail(
    req.body.email,
    "Rays Microfinance HRM system",
    ` 
    <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Snippet - GoSNippets</title>
    <link href='https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css' rel='stylesheet'>
    <link href='' rel='stylesheet'>
    <style> @media screen {
@font-face {
font-family: 'Lato';
font-style: normal;
font-weight: 400;
src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
}

@font-face {
font-family: 'Lato';
font-style: normal;
font-weight: 700;
src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
}

@font-face {
font-family: 'Lato';
font-style: italic;
font-weight: 400;
src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
}

@font-face {
font-family: 'Lato';
font-style: italic;
font-weight: 700;
src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
}
}

/* CLIENT-SPECIFIC STYLES */
body,
table,
td,
a {
-webkit-text-size-adjust: 100%;
-ms-text-size-adjust: 100%;
}

table,
td {
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
}

img {
-ms-interpolation-mode: bicubic;
}

/* RESET STYLES */
img {
border: 0;
height: auto;
line-height: 100%;
outline: none;
text-decoration: none;
}

table {
border-collapse: collapse !important;
}

body {
height: 100% !important;
margin: 0 !important;
padding: 0 !important;
width: 100% !important;
background-color: #f4f4f4;
}

/* iOS BLUE LINKS */
a[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important;
}

/* MOBILE STYLES */
@media screen and (max-width:600px) {
h1 {
font-size: 32px !important;
line-height: 32px !important;
}
}

/* ANDROID CENTER FIX */
div[style*="margin: 16px 0;"] {
margin: 0 !important;
}</style>
    <script type='text/javascript' src=''></script>
    <script type='text/javascript' src='https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js'></script>
    <script type='text/javascript' src='https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js'></script>
</head>    
    <body oncontextmenu='return false' class='snippet-body'>
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
<tr>
<td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
<h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=${process.en.LOGO} width="125" height="120" style="display: block; border: 0px;" />
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
<tr>
<td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
<p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
</td>
</tr>
<tr>
<td bgcolor="#ffffff" align="left">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
            <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="#" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</td>
</tr> <!-- COPY -->
<tr>
<td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
</td>
</tr>
</table>
</td>
</tr>
</table>
    <script type='text/javascript'></script>
    </body>
`
  );

  // save the user to db
  await user.save();

  await token.save();

  // setting the response headers
  res
    .header("x-auth-token", jwt)
    .send(
      _.pick(user, ["_id", "name", "email", "phone", "password", "userRole"])
    );
});

//reset user password route

router.post("/:id/:token", async (req, res) => {
  //validate i.e only password is required
  const schema = Joi.object({ password: Joi.string().min(6).required() });
  // validate the body
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // validate user
  const user = await User.findById(req.params.id);
  if (!user) return res.send("Invalid user or link expired");

  // validate token
  const token = await Token.findOne({
    id: user._id,
    token: req.params.token,
  });

  if (!token) return res.status(400).send("Invalid token ");
  //get the new password from body
  user.password = req.body.password;
  // hash the password
  const salt = await bcrypt.genSalt(10); //bcrypt returns promise therefore await
  // hash the password using the salt
  user.password = await bcrypt.hash(user.password, salt);
  //save the new password with user obj
  await user.save();
  // after password reset delete the token
  await token.delete();

  res.send("password reset successfully");
});

// router.put("/" , async(req , res) => {
//   User.findByIdAndUpdat e(req.params.id)
// })

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

module.exports = router;
