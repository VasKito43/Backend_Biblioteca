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

module.exports = { sendBorrowingEmail };
