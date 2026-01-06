import nodemailer from "nodemailer";
import QRCode from "qrcode";

/* ---------------- APPROVAL EMAIL ---------------- */

export const sendPassEmail = async ({
    to,
    visitorName,
    hostName,
    date,
    purpose,
    passToken,
}) => {
    const qrData = JSON.stringify({ token: passToken });
    const qrImage = await QRCode.toDataURL(qrData);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const html = `
    <h2>Visitor Pass Approved ✅</h2>
    <p>Hello <b>${visitorName}</b>,</p>

    <p>Your appointment has been <b>approved</b>.</p>

    <ul>
      <li><b>Host:</b> ${hostName}</li>
      <li><b>Date:</b> ${new Date(date).toDateString()}</li>
      <li><b>Purpose:</b> ${purpose}</li>
    </ul>

    <p>Please show this QR code at the security desk:</p>
    <img src="${qrImage}" alt="QR Code" />

    <p><b>Pass Token:</b> ${passToken}</p>

    <p>Thank you.</p>
  `;

    await transporter.sendMail({
        from: `"Visitor Management System" <${process.env.MAIL_USER}>`,
        to,
        subject: "Your Visitor Pass is Approved",
        html,
    });
};

/* ---------------- REJECTION EMAIL ---------------- */

export const sendRejectionEmail = async ({
    to,
    visitorName,
    hostName,
    date,
    purpose,
}) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const html = `
    <h2>Appointment Rejected ❌</h2>
    <p>Hello <b>${visitorName}</b>,</p>

    <p>We regret to inform you that your appointment has been <b>rejected</b>.</p>

    <ul>
      <li><b>Host:</b> ${hostName}</li>
      <li><b>Date:</b> ${new Date(date).toDateString()}</li>
      <li><b>Purpose:</b> ${purpose}</li>
    </ul>

    <p>If you believe this is a mistake, please contact the host.</p>

    <p>Thank you for your interest.</p>
  `;

    await transporter.sendMail({
        from: `"Visitor Management System" <${process.env.MAIL_USER}>`,
        to,
        subject: "Appointment Rejected",
        html,
    });
};
