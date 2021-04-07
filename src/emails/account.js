const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sahilsharma.ss387w@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app,${name},Let me know how you get along with the app`
    });
}
const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sahilsharma.ss387w@gmail.com',
        subject: 'Reason for Deleting the account',
        text: `HEYAA!! ${name}, It would be so grateful if you could probably provide us the reason of account deletion ,THANK YOU.`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}