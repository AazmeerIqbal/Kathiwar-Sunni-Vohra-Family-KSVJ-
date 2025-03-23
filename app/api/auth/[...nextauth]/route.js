import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB, closeConnection } from "@/utils/database"; // Adjust this path
import { encrypt } from "@/utils/Encryption";

const sql = require("mssql");

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        const { username, cnic, password, isAdmin } = credentials;

        let pool;
        try {
          // Connect to the database
          pool = await connectToDB();
          console.log("CNIC:", cnic, "isAdmin:", isAdmin);

          // Encrypt password
          const encryptedPassword = encrypt(password);

          if (isAdmin === "true" || isAdmin === true) {
            let query = `
            SELECT * FROM Users 
            WHERE UserName = @username 
            AND UserPassword = @password AND IsAdmin = 1
          `;
            const result = await pool
              .request()
              .input("username", sql.VarChar, username)
              .input("password", sql.VarChar, encryptedPassword)
              .query(query);

            // Check if user exists
            if (result.recordset.length > 0) {
              const user = result.recordset[0];
              console.log("Authenticated User:", user);
              return {
                id: user.UserId,
                name: user.UserName,
                firstName: user.FirstName,
                lastName: user.LastName,
                cnic: user.CNICNo,
                email: user.Email,
                gender: user.Gender,
                companyId: user.CompanyId,
                roleId: user.RoleId,
                imagePath: user.ImagePath,
                isAdmin: user.IsAdmin,
                memberId: user.MemberId,
                memberShipNo: user.MemberShipNo,
              }; // Return user object for session
            } else {
              throw new Error("Invalid username or password");
            }
          } else {
            let query = `
            SELECT * FROM Users 
            WHERE CNICNo = @cnic 
            AND UserPassword = @password
          `;

            // Query the database
            const result = await pool
              .request()
              .input("cnic", sql.VarChar, cnic)
              .input("password", sql.VarChar, encryptedPassword)
              .query(query);

            // Check if user exists
            if (result.recordset.length > 0) {
              const user = result.recordset[0];
              console.log("Authenticated User:", user);
              return {
                id: user.UserId,
                name: user.UserName,
                firstName: user.FirstName,
                lastName: user.LastName,
                cnic: user.CNICNo,
                email: user.Email,
                gender: user.Gender,
                companyId: user.CompanyId,
                roleId: user.RoleId,
                imagePath: user.ImagePath,
                isAdmin: user.IsAdmin,
                memberId: user.MemberId,
                memberShipNo: user.MemberShipNo,
              }; // Return user object for session
            } else {
              throw new Error("Invalid username or password");
            }
          }
        } catch (error) {
          console.error("Error authorizing user:", error);
          return null; // Return null on error
        } finally {
          await closeConnection(); // Close the database connection
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.cnic = user.cnic;
        token.email = user.email;
        token.gender = user.gender;
        token.companyId = user.companyId;
        token.roleId = user.roleId;
        token.imagePath = user.imagePath;
        token.isAdmin = user.isAdmin;
        token.memberId = user.memberId;
        token.memberShipNo = user.memberShipNo;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        firstName: token.firstName,
        lastName: token.lastName,
        cnic: token.cnic,
        email: token.email,
        gender: token.gender,
        companyId: token.companyId,
        roleId: token.roleId,
        imagePath: token.imagePath,
        isAdmin: token.isAdmin,
        memberId: token.memberId,
        memberShipNo: token.memberShipNo,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };
