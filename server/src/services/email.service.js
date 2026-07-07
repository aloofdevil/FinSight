const nodemailer = require('nodemailer');

const isEmailConfigured = () => Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

let testAccount = null;

const createTransporter = async () => {
  if (isEmailConfigured()) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
    console.log('Using Ethereal test email account:', testAccount.user);
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const appName = process.env.APP_NAME || 'FinSight';
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@finsight.app';

  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from,
    to,
    subject: `${appName} password reset`,
    text: [
      `You requested a password reset for ${appName}.`,
      '',
      `Reset your password here: ${resetUrl}`,
      '',
      'This link expires in 15 minutes.',
      'If you did not request this, you can ignore this email.'
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
        <h2>${appName} password reset</h2>
        <p>You requested a password reset for ${appName}.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 14px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;">
            Reset password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('Password reset email preview URL:', previewUrl);
  }

  return { sent: isEmailConfigured(), previewUrl };
};

module.exports = { isEmailConfigured, sendPasswordResetEmail };
