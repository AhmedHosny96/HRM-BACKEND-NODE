const router = require("express").Router();
const Joi = require("joi-browser");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, Validate } = require("../models/user");
const { Token } = require("../models/token");
const sendMail = require("../utils/sendMail");
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
    <body>
    <div style="background-color: #f9f9f9">
    <!--[if mso | IE]>
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->

    <div
      style="
        background: #f9f9f9;
        background-color: #f9f9f9;
        margin: 0px auto;
        max-width: 600px;
      "
    >
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="background: #f9f9f9; background-color: #f9f9f9; width: 100%"
      >
        <tbody>
          <tr>
            <td
              style="
                border-bottom: #333957 solid 5px;
                direction: ltr;
                font-size: 0px;
                padding: 20px 0;
                text-align: center;
                vertical-align: top;
              "
            >
              <!--[if mso | IE]>
                <table
                  role="presentation"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr></tr>
                </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->

    <div
      style="
        background: #fff;
        background-color: #fff;
        margin: 0px auto;
        max-width: 600px;
      "
    >
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="background: #fff; background-color: #fff; width: 100%"
      >
        <tbody>
          <tr>
            <td
              style="
                border: #dddddd solid 1px;
                border-top: 0px;
                direction: ltr;
                font-size: 0px;
                padding: 20px 0;
                text-align: center;
                vertical-align: top;
              "
            >
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             style="vertical-align:bottom;width:600px;"
          >
        <![endif]-->

              <div
                class="mj-column-per-100 outlook-group-fix"
                style="
                  font-size: 13px;
                  text-align: left;
                  direction: ltr;
                  display: inline-block;
                  vertical-align: bottom;
                  width: 100%;
                "
              >
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="vertical-align: bottom"
                  width="100%"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        word-break: break-word;
                      "
                    >
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="border-collapse: collapse; border-spacing: 0px"
                      >
                        <tbody>
                          <tr>
                            
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td
                      align="center"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        padding-bottom: 40px;
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Montserrat,Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif;
                          font-size: 32px;
                          font-weight: bold;
                          line-height: 1;
                          text-align: center;
                          color: #555;
                        "
                      >
                        Email Verification
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td
                      align="center"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        padding-bottom: 0;
                        word-break: break-word;
                      "
                    ></td>
                  </tr>

      
                  <tr>
                    <td
                      align="center"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;                       
                        word-break: break-word;
                      "
                    >
                      <div
                        style="
                          font-family: Montserrat,Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif;
                          font-size: 20px;
                          line-height: 22px;
                          font-weight : 20px;
                          text-align: center;
                          color: #555;
                        "
                      >
                        Dear ${req.body.name} your are  registered in RMFI HRM system To verify click the button below.
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      style="
                        font-size: 0px;
                        padding: 10px 25px;
                        padding-top: 30px;
                        padding-bottom: 40px;
                        word-break: break-word;
                      "
                    >
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="border-collapse: separate; line-height: 100%"
                      >
                        <tr>
                          <td
                            align="center"
                            bgcolor="#800080"
                            role="presentation"
                            style="
                              border: none;
                              border-radius: 3px;
                              color: #ffffff;
                              cursor: auto;
                              padding: 15px 25px;
                            "
                            valign="middle"
                          >
                            <a
                              style="
                                
                                color: #ffffff;
                                font-family: Montserrat,Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif;
                                font-size: 15px;
                                font-weight: normal;
                                line-height: 120%;
                                margin: 0;
                                border-radius : 10px;
                                text-decoration: none;
                                text-transform: none;
                              "
                              href=${emailLink}
                            > 
                              Verify Account
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    
    <table
       align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
    >
      <tr>
        <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
    <![endif]-->

    <div style="margin: 0px auto; max-width: 600px">
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="width: 100%"
      >
        <tbody>
          <tr>
            <td
              style="
                direction: ltr;
                font-size: 0px;
                padding: 20px 0;
                text-align: center;
                vertical-align: top;
              "
            >
              <!--[if mso | IE]>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
              
      <tr>
    
          <td
             style="vertical-align:bottom;width:600px;"
          >
        <![endif]-->

              <div
                class="mj-column-per-100 outlook-group-fix"
                style="
                  font-size: 13px;
                  text-align: left;
                  direction: ltr;
                  display: inline-block;
                  vertical-align: bottom;
                  width: 100%;
                "
              >
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  width="100%"
                >
                  <tbody>
                    <tr>
                      <td style="vertical-align: bottom; padding: 0">
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                        >
                          <tr>
                            <td
                              align="center"
                              style="
                                font-size: 0px;
                                padding: 0;
                                word-break: break-word;
                              "
                            >
                             
                            </td>
                          </tr>

                          <tr>
                            <td
                              align="center"
                              style="
                                font-size: 0px;
                                padding: 10px;
                                word-break: break-word;
                              "
                            >
                              <div
                                style="
                                  font-family: 'Helvetica Neue', Arial,
                                    sans-serif;
                                  font-size: 12px;
                                  font-weight: 300;
                                  line-height: 1;
                                  text-align: center;
                                  color: #575757;
                                "
                              >
                              Copyright @
                                <a href="https://www.raysmfi.com/" style="color: #575757"
                                  >Rays Microfinance Institution</a
                                >
                                
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!--[if mso | IE]>
          </td>
        
      </tr>
    
                </table>
              <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->
  </div>
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
