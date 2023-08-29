const nodemailer= require('nodemailer')


const sendEmail= async options =>{

    // 1) Create a transporter  // like a service like gmail

    const transporter= nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        //service: 'Gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }

        // ACTIVATE IN GMAIL 'LESS SECURE APP' OPTION
    })


    // 2) Define the email address

    const mailOptions={
        from: 'Shahzeb <shahzeb@digirevol.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html, 


    }


    //3) Actually send the email

    await transporter.sendMail(mailOptions)




}
module.exports=sendEmail;