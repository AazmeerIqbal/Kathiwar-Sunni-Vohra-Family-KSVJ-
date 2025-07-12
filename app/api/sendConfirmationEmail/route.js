import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, cnic, familyName, email } = await req.json();

    console.log("Sending Email hitted", name, cnic, familyName, email);

    // Configure your SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email provider
      auth: {
        user: process.env.EMAIL_USER, // set in your .env.local
        pass: process.env.EMAIL_PASS, // set in your .env.local
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Request Submitted",
      html: `
        <h2>Registration Confirmation</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your registration request has been submitted to the admin for review.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>CNIC:</strong> ${cnic}</li>
          <li><strong>Family Name:</strong> ${familyName}</li>
        </ul>
        <p>We will notify you once your request is reviewed.</p>
        <p>Thank you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
