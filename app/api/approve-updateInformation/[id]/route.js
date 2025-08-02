import { NextResponse } from "next/server";
import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";
import nodemailer from "nodemailer";

export async function POST(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Member ID is required." },
      { status: 400 }
    );
  }

  try {
    // Connect to DB
    const pool = await connectToDB();

    // First, get user information including email
    const userRequest = pool.request();
    userRequest.input("MemberId", sql.Int, id);
    const userResult = await userRequest.query(`
      SELECT MemberName, EmailID, CNICNo
      FROM tb_member_mst_test
      WHERE MemberId = @MemberId
    `);

    if (!userResult.recordset || userResult.recordset.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const userData = userResult.recordset[0];
    const { MemberName, EmailID, CNICNo } = userData;

    console.log("Email coming to send email", userData);

    // Execute stored procedure for approval
    const request = pool.request();
    request.input("MemberId", sql.Int, id);

    const result = await request.execute("FetchUserApproveData");

    // Send approval email
    if (EmailID) {
      try {
        // Configure SMTP transporter
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: EmailID,
          subject: "Update Information Request Approved",
          html: `
            <h2>Update Information Approval Confirmation</h2>
            <p>Dear <strong>${MemberName}</strong>,</p>
            <p>Your update information request has been successfully approved by the admin.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li><strong>Name:</strong> ${MemberName}</li>
              <li><strong>CNIC:</strong> ${CNICNo}</li>
            </ul>
            <p>Your updated information is now active in our system.</p>
            <p>Thank you for keeping your information up to date!</p>
            <p>Best regards,<br>KSVJ Team</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Approval email sent successfully to:", EmailID);
      } catch (emailError) {
        console.error("Error sending approval email:", emailError);
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Information approved successfully.",
        data: result.recordset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in approve-updateInformation route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to approve information.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    closeConnection(); // Always close connection
  }
}
