import { Router, type Request, type Response } from "express";
import nodemailer from "nodemailer";

const router = Router();

// ReCAPTCHA Secret Key from user
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || "6Lf19OksAAAAAKFH4VGw2JdUWZL9s3-7ygT9FHkW";

router.post("/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message, captchaToken } = req.body;

    if (!captchaToken) {
      return res.status(400).json({ message: "reCAPTCHA token is required" });
    }

    // Verify reCAPTCHA with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captchaToken}`;
    const response = await fetch(verifyUrl, { method: "POST" });
    const data = await response.json() as { success: boolean; "error-codes"?: string[] };

    if (!data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed", errors: data["error-codes"] });
    }

    // Set up Nodemailer transport
    // User needs to provide SMTP_PASSWORD in their environment variables for this to work
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'zmc@gmail.com',
        pass: process.env.SMTP_PASSWORD || '', 
      }
    });

    const mailOptions = {
      from: 'zmc@gmail.com',
      to: 'zmc@gmail.com', // Sending to yourself
      replyTo: email, // The user's email so you can reply to them
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    try {
      if (!process.env.SMTP_PASSWORD) {
        console.warn("SMTP_PASSWORD is not set. Simulating email sending for now.");
        console.log(`New contact message from ${name} (${email}): ${subject}\n${message}`);
      } else {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to zmc@gmail.com`);
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({ message: "Failed to send email. Check SMTP configuration." });
    }

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
