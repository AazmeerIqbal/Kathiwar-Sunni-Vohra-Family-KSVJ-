import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";
import fs from "fs/promises";
import path from "path";

export async function DELETE(req, { params }) {
  try {
    const { id } = params; // Get document ID from dynamic route params

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Document ID is required" }),
        { status: 400 }
      );
    }

    let pool = await connectToDB(config);

    // Fetch document path from the database before deleting it
    const docResult = await pool
      .request()
      .input("Id", sql.Int, id)
      .query("SELECT DocPath FROM tb_BroadCast WHERE Id = @Id");

    if (docResult.recordset.length === 0) {
      await closeConnection(pool);
      return new Response(JSON.stringify({ message: "Document not found" }), {
        status: 404,
      });
    }

    const docPath = docResult.recordset[0].DocPath;
    const absolutePath = path.join(process.cwd(), "public", docPath);

    // Delete document from the database
    const deleteResult = await pool
      .request()
      .input("Id", sql.Int, id)
      .query("DELETE FROM tb_BroadCast WHERE Id = @Id");

    await closeConnection(pool);

    if (deleteResult.rowsAffected[0] > 0) {
      // Attempt to delete the file from local storage
      try {
        await fs.unlink(absolutePath);
        console.log(`Deleted file: ${absolutePath}`);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
      }

      return new Response(
        JSON.stringify({ message: "Document deleted successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Document not found in database" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Delete Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
