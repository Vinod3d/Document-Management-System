import nodemailer from "nodemailer";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM as string,
    pass: process.env.EMAIL_APP_PASSWORD as string,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Creates an HTML email template with OTP support
 */
function createEmailTemplate(options: {
  title: string;
  body: string;
  otp?: string;
  button?: { text: string; url: string };
  footer?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 30px;
            background-color: #ffffff;
            font-size: 16px;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            background: #f4f4f4;
            padding: 10px;
            display: inline-block;
            border-radius: 5px;
            margin: 10px 0;
        }
        .email-footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            background-color: #f9f9f9;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #4338ca;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>${options.title}</h1>
        </div>
        <div class="email-body">
            <p>${options.body.replace(/\n/g, '<br>')}</p>
            ${
              options.otp
                ? `<p>Your OTP code is:</p><p class="otp">${options.otp}</p>`
                : ''
            }
            ${
              options.button
                ? `<div style="text-align: center;"><a href="${options.button.url}" class="button">${options.button.text}</a></div>`
                : ''
            }
        </div>
        <div class="email-footer">
            ${options.footer || '© ' + new Date().getFullYear() + ' Your Company. All rights reserved.'}
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Sends an email with OTP support
 */
export async function sendEmail(
  to: string,
  subject: string,
  content: {
    text: string;
    html?: {
      title: string;
      body: string;
      otp?: string;
      button?: { text: string; url: string };
      footer?: string;
    };
  }
): Promise<void> {
  try {
    const mailOptions: MailOptions = {
      from: `"Your Company" <${process.env.EMAIL_FROM as string}>`,
      to,
      subject,
      text: content.text,
      ...(content.html && { html: createEmailTemplate(content.html) }),
    };

    console.log("📩 Final Email Content:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent: ", info.response);
  } catch (error) {
    console.error("❌ Email Send Error: ", error);
    throw new Error("Failed to send email.");
  }
}
