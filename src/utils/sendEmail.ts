import nodemailer from 'nodemailer'
import { login_email_body } from './emailBody'

export const sendEmail = (name: string, email: string) => {
  const mail = login_email_body

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', // use your email service
    host: 'mail.google.com', // use your email service host name
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
      // use your email and password
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
    // tls: {
    //   rejectUnauthorized: false,
    // },
  })

  // setup email data with unicode symbols
  let mailOptions = {
    from: process.env.EMAIL, // sender address
    to: email, // list of receivers
    subject: 'Welcome to DAM', // Subject line
    text: 'Hello world?', // plain text body
    html: mail // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error)
    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  })
}
