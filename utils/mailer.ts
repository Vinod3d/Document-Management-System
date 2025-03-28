import nodemailer from "nodemailer";
import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // ✅ Add redirect URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
});

async function getAccessToken() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    return accessToken?.token; // ✅ Fix: Ensure token is properly returned
  } catch (error) {
    console.error("Failed to generate access token:", error);
    throw new Error("Failed to generate access token");
  }
}

export async function sendEmail(to: string, subject: string, text: string) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Access token is undefined.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // ✅ Use 587 if you want STARTTLS
    secure: true, // ✅ `true` for port 465, `false` for port 587
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_FROM,
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}
