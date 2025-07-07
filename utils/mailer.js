// mailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
async function sendBorrowingEmail(to, userName, bookTitle, dueDate) {
  await transporter.sendMail({
    from: `"Biblioteca" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Confirmação de Empréstimo',
    html: `
      <p>Olá ${userName},</p>
      <p>Você realizou um novo empréstimo do livro <strong>${bookTitle}</strong>.</p>
      <p>Data de empréstimo: ${new Date().toLocaleDateString('pt-BR')}</p>
      <p>Data prevista de devolução: <strong>${dueDate}</strong></p>
      <p>Qualquer dúvida, entre em contato.</p>
    `
  });
}

async function sendReturnEmail(to, name, title, fine) {
   const mailOptions = {
     from:    process.env.SMTP_USER,
     to,
     subject: `Devolução de "${title}" registrada`,
     html:    `<p>Olá ${name},</p>
               <p>Seu empréstimo do livro "<strong>${title}</strong>" foi devolvido com sucesso.</p>
               <p>Multa paga: R$ ${fine.toFixed(2)}</p>`
   };
   return transporter.sendMail(mailOptions);
 }

module.exports = { sendBorrowingEmail, sendReturnEmail };
