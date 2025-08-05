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

    // First, get CNIC from tb_member_mst_test
    const cnicRequest = pool.request();
    cnicRequest.input("MemberId", sql.Int, id);
    const cnicResult = await cnicRequest.query(`
      SELECT CNICNo, MemberName, EmailID
      FROM tb_member_mst_test
      WHERE MemberId = @MemberId
    `);

    if (!cnicResult.recordset || cnicResult.recordset.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const { CNICNo, MemberName, EmailID } = cnicResult.recordset[0];

    // if (
    //   !membershipResult.recordset ||
    //   membershipResult.recordset.length === 0
    // ) {
    //   return NextResponse.json(
    //     { success: false, message: "Membership number not found." },
    //     { status: 404 }
    //   );
    // }

    // Execute stored procedure for approval
    const request = pool.request();
    request.input("MemberId", sql.Int, id);

    const result = await request.execute("FetchUserApproveData");

    // Get MemberShipNo from tb_member_mst using CNIC
    const membershipRequest = pool.request();
    membershipRequest.input("CNICNo", sql.VarChar, CNICNo);
    const membershipResult = await membershipRequest.query(`
       SELECT MemberShipNo
       FROM tb_member_mst
       WHERE CNICNo = @CNICNo
     `);

    const { MemberShipNo } = membershipResult.recordset[0];

    // Send welcome email
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
          subject: "Welcome to KSVJ Community - Registration Approved",
          html: `
            <h2>Welcome to KSVJ Community!</h2>
            <p>Dear <strong>${MemberName}</strong>,</p>
            <p>Congratulations! Your registration has been successfully approved by the admin.</p>
            <p>You are now a proud member of the Kathiwar Sunni Vohra Family (KSVJ) Community!</p>
            <p><strong>Your Membership Details:</strong></p>
            <ul>
              <li><strong>Name:</strong> ${MemberName}</li>
              <li><strong>CNIC:</strong> ${CNICNo}</li>
              <li><strong>Membership Number:</strong> ${MemberShipNo}</li>
            </ul>
            <p>Welcome to our community! We're excited to have you as part of our family.</p>
            <p>Best regards,<br>KSVJ Team</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully to:", EmailID);
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration approved successfully.",
        data: result.recordset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in approve-newRegisteration route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to approve registration.",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    closeConnection(); // Always close connection
  }
}
