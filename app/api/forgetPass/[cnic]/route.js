import crypto from "crypto";
import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { cnic } = params;

  if (!cnic) {
    return NextResponse.json({ message: "CNIC is required" }, { status: 400 });
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
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10); //valid for 10 minutes

    //Delete Previous token of this user
    const deleteTokenQuery = `Delete from PasswordResetTokens where UserId=@UserId`;

    await pool.request().input("UserId", user.UserId).query(deleteTokenQuery);

    // Save token in the database
    const saveTokenQuery = `
      INSERT INTO PasswordResetTokens (UserId, Token, ExpirationTime, Used)
      VALUES (@UserId, @Token, @ExpirationTime, 0);
    `;

    console.log("Local Time:", expirationTime.toLocaleString());

    await pool
      .request()
      .input("UserId", user.UserId)
      .input("Token", token)
      .input("ExpirationTime", expirationTime)
      .query(saveTokenQuery);

    await closeConnection(pool);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    return NextResponse.json({
      message: "Password reset link generated.",
      data: {
        email: user.Email,
        userId: user.UserId,
        password: user.UserPassword,
        username: user.Username,
        cnic: user.CNICNo,
        resetLink: resetLink,
      },
    });
  } catch (error) {
    console.error("Error generating reset link:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
