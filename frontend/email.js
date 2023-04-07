
const { Subject } = require('@mui/icons-material');
const sgMail = require('@sendgrid/mail');
const { error } = require('console');

const SENDGRID_API_KEY =
'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'

sgMail.setApiKey(SENDGRID_API_KEY);

const message = {
    to: 'b6221928@g.sut.ac.th',
    from: 'keng-085@hotmail.com',
    Subject: 'Hello',
    text: 'This is some text',
};


sgMail
    .send(message)
    .then(() => {
        console.log('\nThe massage has been sent successfully.\n');
    })
    .catch((error) => {
        console.log(error);
    });