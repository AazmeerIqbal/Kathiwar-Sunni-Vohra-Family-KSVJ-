import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";

export async function DELETE(req, { params }) {
  try {
    const { id } = params; // Get education ID from dynamic route params

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Education ID is required" }),
        { status: 400 }
      );
    }

    let pool = await connectToDB(config);

    // Delete education information from the database
    const deleteResult = await pool
      .request()
      .input("LivingId", id)
      .query(
        "DELETE FROM tb_member_living_det_test WHERE LivingId = @LivingId"
      );

    await closeConnection(pool);

    if (deleteResult.rowsAffected[0] > 0) {
      return new Response(
        JSON.stringify({
          message: "Living information deleted successfully",
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Living information not found in database",
        }),
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
