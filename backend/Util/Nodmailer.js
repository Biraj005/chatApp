import 'dotenv/config'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:"email",
     host: "smtp.gmail.com",
    port: 587, // TLS
    secure: false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
})
export default transporter