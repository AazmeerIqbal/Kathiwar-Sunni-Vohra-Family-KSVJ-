import { connectToDB, closeConnection, config } from "@/utils/database";
import { NextResponse } from "next/server";
import { encrypt } from "@/utils/Encryption";

export async function POST(req) {
  const {
    username,
    firstName,
    lastName,
    email,
    memberId,
    cnic,
    password,
    gender,
  } = await req.json();

  // Validate required fields
  if (
    !username ||
    !firstName ||
    !lastName ||
    !email ||
    !cnic ||
    !password ||
    !gender
  ) {
    return NextResponse.json(
      { message: "All required fields must be provided" },
      { status: 400 }
    );
  }

  // Convert gender to 'M' or 'F'
  const genderValue =
    gender === "male" ? "M" : gender === "female" ? "F" : null;

  if (!genderValue) {
    return NextResponse.json(
      { message: "Invalid gender value provided" },
      { status: 400 }
    );
  }

  const insertQuery = `
    INSERT INTO Users (UserName, FirstName, LastName, Email, MemberId, CNICNo, UserPassword, Gender, CompanyId, RoleId)
    VALUES (@Username, @FirstName, @LastName, @Email, @MemberId, @CNICNo, @UserPassword, @Gender, @CompanyId, @RoleId);
  `;

  try {
    const pool = await connectToDB(config);

    // Insert user data into the database
    await pool
      .request()
      .input("Username", username)
      .input("FirstName", firstName)
      .input("LastName", lastName)
      .input("Email", email)
      .input("MemberId", memberId || null) // If memberId is null, set it to NULL in the DB
      .input("CNICNo", cnic)
      .input("UserPassword", encrypt(password))
      .input("Gender", genderValue)
      .input("CompanyId", "12")
      .input("RoleId", "55")
      .query(insertQuery);

    await closeConnection(pool);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting user data:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
