const  nodeMailerHelp = require('./nodeMailerHelp');


module.exports ={

   async sendLoginAlert(name,toEmail, info) {
  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Login Alert</title>
  <style>
    body, table, td { margin:0; padding:0; font-family: Arial, sans-serif; }
    a { color: #1a82e2; text-decoration: none; pointer:cursor;}
    .container { width:100%; background:#f4f4f4; padding:20px 0; }
    .content   { max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden; }
    .header    { background:#1a82e2; color:#fff; text-align:center; padding:30px 20px; }
    .header h1 { margin:0; font-size:24px; }
    .body      { padding:30px 20px; color:#333; line-height:1.5; }
    .body h2   { font-size:20px; margin-top:0; }
    .body p    { margin:16px 0; }
    .btn       { display:inline-block; background:#1a82e2; color:#fff; padding:12px 24px; border-radius:4px; font-size:16px; }
    .footer    { background:#f4f4f4; color:#777; text-align:center; padding:20px; font-size:12px; }
  </style>
</head>
<body>
  <table class="container" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <table class="content" cellpadding="0" cellspacing="0">
          
          <!-- Header -->
          <tr>
            <td class="header">
              <h1>New Login Detected</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td class="body">
              <h2>Hello ${name},</h2>
              <p>We noticed a login to your account with the following details:</p>
              <ul>
                <li><strong>Time:</strong> ${info.time}</li>
                <li><strong>IP Address:</strong> ${info.ip}</li>
                <li><strong>Device/Browser:</strong> ${info.userAgent}</li>
              </ul>
              <p>If this was you, no further action is needed.</p>
              <p>If you did <em>not</em> authorize this login, please secure your account immediately by clicking below:</p>
              <p style="text-align:center;">
                <a href="{{RESET_LINK}}" class="btn">Reset Your Password</a>
              </p>
              <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
              <p><a href="{{RESET_LINK}}">{{RESET_LINK}}</a></p>
              <p>Thank you,<br>Your App Team</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>FWAN Market &bull; 123 Harvest Road, Lagos, NG</p>
              <p><a href="https://yourapp.com/terms">Terms</a> | <a href="https://yourapp.com/privacy">Privacy</a></p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await nodeMailerHelp.sendEmail({
    to: toEmail,
    subject: "New Login Alert 🔒",
    html
  });
},


}