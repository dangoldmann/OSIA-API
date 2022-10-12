const client = require('@sendgrid/mail')

client.setApiKey(process.env.SENDGRID_API_KEY)

const sendResetPasswordEmail = (email, link) => {
    client
        .send({
            to: email,
            from: 'osiaapp@gmail.com',
            templateId: 'd-552e2fec003a49e8a2e42f3fb788a9ba',
            dynamicTemplateData: {
                link
            }
        })
        .then(() => console.log('Email sent'))
        .catch(err => console.log(err.message))
}

module.exports = {sendResetPasswordEmail}