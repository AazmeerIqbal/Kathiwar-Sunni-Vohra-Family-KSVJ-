import sql from "mssql";
import { connectToDB, closeConnection, config } from "@/utils/database";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // Get Living ID from dynamic route params
    const data = await req.json(); // Parse request body

    let pool = await connectToDB(config);

    const updateResult = await pool
      .request()
      .input("MemberId", sql.Int, data.MemberId)
      .input("LivingCountryID", sql.Int, data.LivingCountryID)
      .input("LivingStateID", sql.Int, data.LivingStateID)
      .input("LivingCityID", sql.Int, data.LivingCityID)
      .input("DateFrom", sql.Date, data.DateFrom)
      .input("DateTo", sql.Date, data.DateTo)
      .input("Remarks", sql.NVarChar, data.Remarks)
      .input("Address", sql.NVarChar, data.Address)
      .input("LivingId", sql.Int, id) // Use ID from params
      .query(`
        UPDATE tb_member_living_det_test
        SET LivingCountryID = @LivingCountryID, 
            LivingStateID = @LivingStateID, 
            LivingCityID = @LivingCityID, 
            DateFrom = @DateFrom, 
            DateTo = @DateTo, 
            Remarks = @Remarks, 
            Address = @Address
        WHERE LivingId = @LivingId
      `);

    await closeConnection(pool);

    if (updateResult.rowsAffected[0] > 0) {
      return new Response(
        JSON.stringify({ message: "Living details updated successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Living details not found in database" }),
        { status: 404 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "PUT request failed", details: error.message }),
      { status: 500 }
    );
  }
}
