import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";
import { encrypt } from "@/utils/Encryption";

export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { message: "Token and password are required." },
      { status: 400 }
    );
  }

  const currentTime = new Date();

  const checkTokenQuery = `
    SELECT UserId 
    FROM PasswordResetTokens
    WHERE Token = @Token AND ExpirationTime > @currentTime AND Used = 0;
  `;

  const updatePasswordQuery = `
    UPDATE Users 
    SET UserPassword = @NewPassword
    WHERE UserId = @UserId;
  `;

  const markTokenUsedQuery = `
    UPDATE PasswordResetTokens
    SET Used = 1
    WHERE Token = @Token;
  `;

  try {
    const pool = await connectToDB(config);

    const tokenResult = await pool
      .request()
      .input("Token", token)
      .input("currentTime", currentTime)
      .query(checkTokenQuery);

    if (tokenResult.recordset.length === 0) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    const userId = tokenResult.recordset[0].UserId;

    await pool
      .request()
      .input("NewPassword", encrypt(password)) // Add encryption if needed
      .input("UserId", userId)
      .query(updatePasswordQuery);

    await pool.request().input("Token", token).query(markTokenUsedQuery);

    await closeConnection(pool);

    return NextResponse.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
