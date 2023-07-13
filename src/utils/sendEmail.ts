import nodemailer from 'nodemailer'
import { emailBody } from './emailBody'

export const sendRegisterEmail = (user: any) => {
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
    to: user.email, // list of receivers
    subject: 'Welcome to DAM', // Subject line
    text: 'Hello world?', // plain text body
    html: emailBody(user) // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw error
    // console.log('Message sent: %s', info.messageId)
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  })
}

export const sendLoginEmail = (user: any) => {
  const emailBody = `
  <p>Dear ${user.name},</p>
  <p></p>
  <p>A login was detected from ${user.email}</p>
  <p></p>
  <p>Ignore if it was you.</p>
  `

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
    to: user.email, // list of receivers
    subject: 'Login detected', // Subject line
    text: 'Hello world?', // plain text body
    html: emailBody // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw error
    // console.log('Message sent: %s', info.messageId)
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  })
}

export const sendOtpEmail = (user: any, otp: string) => {
  const emailBody = `
  <p>Dear ${user.name},</p>
  <p></p>
  <p>The OTP for password change is:</p>
  <h1>${otp}</h1>
  <p>It will expire in 10 minutes</p>
  <p></p>
  <p>Do not share this OTP with anyone</p>
  `

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
    to: user.email, // list of receivers
    subject: 'OTP for password change', // Subject line
    text: 'Hello world?', // plain text body
    html: emailBody // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw error
    // console.log('Message sent: %s', info.messageId)
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  })
}

export const sendPasswordChangeEmail = (user: any) => {
  const emailBody = `
  <p>Dear ${user.name},</p>
  <p></p>
  <p>As per your request, your DAM account password has been changed, you may now login into your account and continue</p>
  <p></p>
  <p>With Thanks, Team DAM</p>
  `

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
    to: user.email, // list of receivers
    subject: 'Password changed', // Subject line
    text: 'Hello world?', // plain text body
    html: emailBody // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) throw error
    // console.log('Message sent: %s', info.messageId)
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  })
}
