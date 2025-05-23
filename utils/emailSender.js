
const nodeMailerHelp = require("./nodeMailerHelp");

exports.sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/api/v1/auth/verify-email?verificationToken=${verificationToken}&email=${email}`;

  const message = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    /* Reset styles */ 
    body, table, td { margin:0; padding:0; font-family: Arial, sans-serif; }
    img { border:0; display:block; }
    a { color:rgb(33, 136, 220); text-decoration: none; }
    /* Container */
    .email-container { width: 100%; background-color: #f4f4f4; padding: 20px 0; }
    .email-content  { max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; }
    /* Header */
    .email-header { background: #1a82e2; color: #ffffff; text-align: center; padding: 40px 20px; }
    .email-header h1 { margin: 0; font-size: 24px; }
    /* Body */
    .email-body { padding: 30px 20px; color: #333333; line-height: 1.5; }
    .email-body h2 { font-size: 20px; margin-top: 0; }
    .email-body p  { margin: 20px 0; }
    /* Button */
    .btn { display: inline-block; background-color: #1a82e2; color: #ffffff; padding: 12px 24px; border-radius: 4px; font-size: 16px; pointer:cursor; }
    /* Footer */
    .email-footer { background: #f4f4f4; color: #777777; text-align: center; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <table class="email-container" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <table class="email-content" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td class="email-header">
              <h1>Welcome to FWAN Marketplace!</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td class="email-body">
              <h2>Verify Your Email Address</h2>
              <p>Hi there ${name},</p>
              <p>Thanks for signing up for <strong>FWAN marketplace</strong>—the secure marketplace for farmers and buyers. To get started, please verify your email address by clicking the button below:</p>
              
              <p style="text-align:center;">
                <a href="${verifyEmail}" class="btn">Verify My Email</a>
              </p>
              
              <p>If the button doesn’t work, copy and paste this link into your browser:</p>
              <p><a href="{{VERIFY_LINK}}">${verifyEmail}</a></p>
              
              <p>This link will expire in 24 hours. If you didn’t create an account, just ignore this email.</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="email-footer">
              <p>FWAN Inc.<br>
              123 Harvest Road, Lagos, NG</p>
              <p><a href="fwan.com.ng">Terms of Service</a> | <a href="">Privacy Policy</a></p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return nodeMailerHelp.sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: message,
  });
};

exports.sendResetPasswordEmail = async ({
  name,
  email,
  passwordResetToken,
  origin,
}) => {
  const resetURL = `${origin}/user/reset-password?token=${passwordResetToken}&email=${email}`;
  const message = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body, table, td { margin:0; padding:0; font-family: Arial, sans-serif; }
    img { display:block; border:0; }
    a { color: #1a82e2; text-decoration: none; }
    .wrapper { width:100%; background:#f4f4f4; padding:20px 0; }
    .content { max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .header { background:#1a82e2; color:#ffffff; text-align:center; padding:30px 20px; }
    .header h1 { margin:0; font-size:24px; }
    .body { padding:30px 20px; color:#333333; line-height:1.5; }
    .body h2 { font-size:20px; margin-top:0; }
    .body p { margin:16px 0; }
    .btn { display:inline-block; background:#1a82e2; color:#ffffff; padding:12px 24px; border-radius:4px; font-size:16px; }
    .footer { background:#f4f4f4; color:#777777; text-align:center; padding:20px; font-size:12px; }
  </style>
</head>
<body>
  <table class="wrapper" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <table class="content" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td class="header">
              <h1>Password Reset Request</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td class="body">
              <h2>Hello ${name},</h2>
              <p>We received a request to reset your password for your account. Click the button below to choose a new password:</p>
              
              <p style="text-align:center;">
                <a href="${resetURL}" class="btn">Reset My Password</a>
              </p>
              
              <p>If the button doesn’t work, copy and paste this link into your browser:</p>
              <p><a href="${resetURL}">${resetURL}</a></p>
              
              <p>This link will expire in 15 mins. If you didn’t request a password reset, please ignore this email or contact support if you have questions.</p>
              
              <p>Thanks,<br>FWAN Marketplace Team</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>FWAN marketplace. &bull; 123 Harvest Road, Lagos, NG</p>
              <p><a href="https://agriconnect.example.com/terms">Terms of Service</a> | <a href="https://agriconnect.example.com/privacy">Privacy Policy</a></p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return nodeMailerHelp.sendEmail({
    to: email,
    subject: "Reset Password",
    html: `${message}`,
  });
};

exports.passwordResetSuccessEmail = async ({ name, email, origin }) => {
  const message = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Successfully Reset</title>
  <style>
    body, table, td { margin:0; padding:0; font-family: Arial, sans-serif; }
    img { display:block; border:0; }
    a { color: #1a82e2; text-decoration: none; }
    .wrapper { width:100%; background:#f4f4f4; padding:20px 0; }
    .content { max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .header { background:#28a745; color:#ffffff; text-align:center; padding:30px 20px; }
    .header h1 { margin:0; font-size:24px; }
    .body { padding:30px 20px; color:#333333; line-height:1.5; }
    .body h2 { font-size:20px; margin-top:0; }
    .body p { margin:16px 0; }
    .footer { background:#f4f4f4; color:#777777; text-align:center; padding:20px; font-size:12px; }
  </style>
</head>
<body>
  <table class="wrapper" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <table class="content" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td class="header">
              <h1>Password Reset Successful</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td class="body">
              <h2>Hi ${name},</h2>
              <p>Your password has been successfully reset. You can now log in with your new password.</p>
              
              <p style="text-align:center;">
                <a href="${origin}" style="display:inline-block;background:#28a745;color:#fff;padding:12px 24px;border-radius:4px;font-size:16px;">Log In Now</a>
              </p>
              
              <p>If you did not request this change, please contact our support team immediately at <a href="mailto:{{SUPPORT_EMAIL}}">{{SUPPORT_EMAIL}}</a>.</p>
              
              <p>Thank you for using FWAN Marketplace!</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>FWAN Marketplace. &bull; 123 Harvest Road, Lagos, NG</p>
              <p><a href="https://agriconnect.example.com/terms">Terms of Service</a> | <a href="https://agriconnect.example.com/privacy">Privacy Policy</a></p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return nodeMailerHelp.sendEmail({
    to: email,
    subject: "Password Reset Successful",
    html: `${message}`,
  });
};
