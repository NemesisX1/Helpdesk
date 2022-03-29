var nodeoutlook = require('nodejs-nodemailer-outlook')

module.exports = {
    sendMail: function helpdeskSendEmail(to, title, subject)  {
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            },
            from: process.env.MAILER_EMAIL,
            to: to,
    
            subject: title,
            html: subject,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
        });
    },

    sendCcMail: function helpdeskCcSendEmail(to, title, subject)  {
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.MAILER_EMAIL,
                pass: process.env.MAILER_PASSWORD
            },
            from: process.env.MAILER_EMAIL,
            cc: to,
    
            subject: title,
            html: subject,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i),
        });
    }
}