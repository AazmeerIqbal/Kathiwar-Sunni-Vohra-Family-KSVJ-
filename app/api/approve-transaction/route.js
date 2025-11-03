import { connectToDB, closeConnection } from "@/utils/database";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function DELETE(req) {
  try {
    // Get MemberId and DateAndTime from query parameters
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");
    const dateAndTime = searchParams.get("dateAndTime");

    if (!memberId || !dateAndTime) {
      return NextResponse.json(
        { message: "MemberId and DateAndTime are required." },
        { status: 400 }
      );
    }

    const pool = await connectToDB();

    // First, fetch the screenshot path before deleting
    const fetchResult = await pool
      .request()
      .input("MemberId", memberId)
      .input("DateAndTime", dateAndTime)
      .query(`
        SELECT ScreenShot 
        FROM TransactionHistorySS 
        WHERE MemberId = @MemberId AND DateAndTime = @DateAndTime
      `);

    if (fetchResult.recordset.length === 0) {
      await closeConnection();
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 }
      );
    }

    const screenshotPath = fetchResult.recordset[0].ScreenShot;

    // Delete the transaction from database
    const deleteResult = await pool
      .request()
      .input("MemberId", memberId)
      .input("DateAndTime", dateAndTime)
      .query(`
        DELETE FROM TransactionHistorySS 
        WHERE MemberId = @MemberId AND DateAndTime = @DateAndTime
      `);

    await closeConnection();

    if (deleteResult.rowsAffected[0] > 0) {
      // Attempt to delete the screenshot file from storage
      if (screenshotPath) {
        try {
          const filePath = path.join(process.cwd(), "public", screenshotPath);
          await fs.unlink(filePath);
          console.log(`Deleted screenshot file: ${filePath}`);
        } catch (fileError) {
          console.error("Error deleting screenshot file:", fileError);
          // Continue even if file deletion fails
        }
      }

      return NextResponse.json({
        message: "Transaction approved and deleted successfully.",
      });
    } else {
      return NextResponse.json(
        { message: "Transaction not found in database." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

