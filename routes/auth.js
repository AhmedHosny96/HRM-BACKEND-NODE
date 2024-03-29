const express = require("express");
const Joi = require("joi-browser");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const router = express.Router();
const { Employee } = require("../models/employee");
const sendMail = require("../utils/sendMail");
const auth = require("../middlewares/auth");
// getting currently logged in user

router.get("/me", async (req, res) => {
  const user = await User.findById(req.body._id).select("-password"); // exclude the password so itsnot exposed in the response
  res.send(user);
});

// login request
router.post("/", async (req, res) => {
  // validate
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //check if user email is correct
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Username or Password");
  //check if password in req = password in db
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid Username or Password");

  if (user.status == "Deactivated")
    return res
      .status(403)
      .send("user is deactivated, please contact your system admin.");

  // if (user.status != "Verified")
  //   return res
  //     .status(400)
  //     .send("User not verified yet , please check your email");

  // generate auth token and return the token
  const token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  };
  return Joi.validate(user, schema);
}

// user sign up

router.post("/create", async (req, res) => {
  // generate one-time password

  const oneTimePassword = otpGenerator.generate(8, {
    digits: true,
    alphabets: true,
    upperCase: true,
    specialChars: true,
  });

  //validate inputs

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.employeeId);
  if (!employee) return res.status(404).send("Invalid employee Id");

  let user = await User.findOne({
    email: req.body.email,
  });

  if (user) return res.status(400).send("Email or username is taken");

  // hash , salt the password then save the user object
  const salt = await bcrypt.genSalt(10);

  user = new User({
    employee: {
      _id: employee._id,
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      phoneNumber: employee.phoneNumber,
      branch: {
        _id: employee.branch._id,
        status: employee.branch.status,
        name: employee.branch.name,
        city: employee.branch.city,
        region: employee.branch.region,
      },
      job: {
        _id: employee.job._id,
        code: employee.job.code,
        name: employee.job.name,
        department: employee.job.department,
      },
      email: employee.email,
      salary: employee.salary,
      status: employee.status,
      employmentStatus: employee.employmentStatus,
      gender: employee.gender,
    },

    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    password: await bcrypt.hash(oneTimePassword, salt),
  });

  // create token and generate header
  const token = user.generateAuthToken();
  user.token = token;
  user.firstLogin = 1;
  await user.save();

  // send the email

  sendMail(
    req.body.email,
    "Rays Microfinance HRM",
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
                          One time password
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
                          Dear ${req.body.username} your are  registered in RMFI HRM system your One-time password is :- 
                          <p>${oneTimePassword}</p>
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
  // exclude the password from the response

  const { password, ...others } = user._doc;
  res.status(201).header("x-auth-token", token).send(others);
});

// chnage password route

router.post("/change-password/:id", async (req, res) => {
  let user = await User.findById(req.params.id);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.firstLogin = 0;
  user.status = "Active";
  user.token = undefined;

  await user.save();

  res.send("User successfully verified");
});

// reset user password

router.post("/reset-password/:id", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const oneTimePassword = otpGenerator.generate(8, {
    digits: true,
    alphabets: true,
    upperCase: true,
    specialChars: true,
  });
  // find the user
  let user = await User.findById(req.params.id);
  user.firstLogin = 1;
  user.status = "Not verified";

  user.password = await bcrypt.hash(oneTimePassword, salt);

  console.log(user.email);

  sendMail(
    user.email,
    "Rays Microfinance HRM ",
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
                          Password reset
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
                          Dear ${user.username} your password has been reset  here is your One-time password  :- 
                          <p> ${oneTimePassword}</p>
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

  await user.save();

  res.status(200).send("password reset successfull");
});

module.exports = router;
