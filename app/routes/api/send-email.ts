// In app/routes/api/send-email.ts
import { json } from "@remix-run/node";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import type { ActionFunction } from "@remix-run/node";
import { getAuth } from "firebase-admin/auth";
import { getApp } from "firebase-admin/app";
import { initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Verify the Firebase ID token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get the user's OAuth access token
    const user = await admin.auth().getUser(decodedToken.uid);
    const accessToken = user.providerData[0]?.providerId === "google.com" 
      ? await admin.auth().createCustomToken(decodedToken.uid)
      : null;

    if (!accessToken) {
      throw new Error("User is not authenticated with Google");
    }

    const formData = await request.formData();
    const { subject, message, recipient } = Object.fromEntries(formData);
    const attachment = formData.get("attachment") as File | null;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: user.email || undefined,
        accessToken,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: user.refreshToken,
      },
    });

    const mailOptions = {
      from: `${user.displayName || "User"} <${user.email}>`,
      to: recipient,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
      attachments: attachment
        ? [
            {
              filename: attachment.name,
              content: Buffer.from(await attachment.arrayBuffer()),
              contentType: attachment.type,
            },
          ]
        : [],
    };

    const result = await transport.sendMail(mailOptions);
    return json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return json(
      { 
        error: "Failed to send email", 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
};