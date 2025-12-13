import crypto from "crypto";
import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req, { params }) {
  const { cnic } = await params;

  if (!cnic) {
    return NextResponse.json({ message: "CNIC is required" }, { status: 400 });
  }

  // Get the base URL for the reset link
  // Priority: 1. Environment variable, 2. Request headers, 3. localhost (dev only)
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  if (!baseUrl) {
    // Try to construct from request headers (works in production behind proxy/load balancer)
    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 
                     (req.headers.get('x-forwarded-ssl') === 'on' ? 'https' : 'http');
    
    if (host) {
      baseUrl = `${protocol}://${host}`;
    } else {
      // Fallback to localhost (should only happen in development)
      baseUrl = 'http://localhost:3000';
    }
  }

  const checkEmailQuery = `
    SELECT UserId, UserPassword, Email, Username, CNICNo
    FROM Users 
    WHERE CNICNo = @CNICNo;
  `;

  try {
    const pool = await connectToDB(config);

    const result = await pool
      .request()
      .input("CNICNo", cnic)
      .query(checkEmailQuery);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: `User with CNIC ${cnic} does not exist.` },
        { status: 400 }
      );
    }

    const user = result.recordset[0];
    const token = crypto.randomBytes(32).toString("hex");
    
    // Use UTC time to avoid timezone issues
    const expirationTime = new Date();
    expirationTime.setUTCMinutes(expirationTime.getUTCMinutes() + 10); //valid for 10 minutes

    //Delete Previous token of this user
    const deleteTokenQuery = `Delete from PasswordResetTokens where UserId=@UserId`;

    await pool.request().input("UserId", user.UserId).query(deleteTokenQuery);

    // Save token in the database
    const saveTokenQuery = `
      INSERT INTO PasswordResetTokens (UserId, Token, ExpirationTime, Used)
      VALUES (@UserId, @Token, @ExpirationTime, 0);
    `;

    await pool
      .request()
      .input("UserId", user.UserId)
      .input("Token", token)
      .input("ExpirationTime", expirationTime)
      .query(saveTokenQuery);

    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // Send email using Nodemailer
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.Email,
        subject: "Password Recovery - KSVJ",
        html: `
          <h2>Password Recovery Request</h2>
          <p>Dear <strong>${user.Username}</strong>,</p>
          <p>You have requested to recover your password.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li><strong>Username:</strong> ${user.Username}</li>
            <li><strong>CNIC:</strong> ${user.CNICNo}</li>
          </ul>
          <p>Click the link below to reset your password. This link will expire in 10 minutes.</p>
          <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p>If you did not request this password reset, please ignore this email.</p>
          <p>Best regards,<br>KSVJ Team</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Password recovery email sent successfully to:", user.Email);
    } catch (emailError) {
      console.error("Error sending password recovery email:", emailError);
      await closeConnection(pool);
      return NextResponse.json(
        { message: "Failed to send password recovery email. Please try again later." },
        { status: 500 }
      );
    }

    await closeConnection(pool);

    return NextResponse.json({
      message: "Password reset link has been sent to your email.",
      success: true,
    });
  } catch (error) {
    console.error("Error generating reset link:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
