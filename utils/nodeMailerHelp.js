const nodeMailer = require('nodemailer');
const nodeMailerConfig = require('../config/nodeMailerConfig')



// contains the send email logic(transport and sendmail)

exports.sendEmail = async ({ to, subject, html }) => {
    let testAccount = await nodeMailer.createTestAccount();

    const transporter = nodeMailer.createTransport(nodeMailerConfig);


    return transporter
      .sendMail({
        from: `"FWAN" <${process.env.NODE_MAILER_FROM}>`,
        to,
        subject,
        html,
      })
      .then((resp) => console.log(resp))
      .catch((error) => console.log(error));

};