import { connectToDB, closeConnection, config } from "@/utils/database";
import sql from "mssql";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ message: "Wife ID is required" }), {
        status: 400,
      });
    }

    let pool = await connectToDB(config);

    // Delete wife details from the database
    const deleteResult = await pool
      .request()
      .input("memberwifeId", sql.Int, id)
      .query(
        `DELETE FROM tb_member_wife_det_test 
         WHERE memberwifeId = @memberwifeId`
      );

    await closeConnection(pool);

    if (deleteResult.rowsAffected[0] > 0) {
      return new Response(
        JSON.stringify({ message: "Wife information deleted successfully" }),
        { status: 200 }
      );
    } else {x
      return new Response(
        JSON.stringify({ message: "Wife information not found in database" }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Delete Error:", error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
