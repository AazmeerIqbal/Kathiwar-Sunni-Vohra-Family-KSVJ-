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
        const { cnic, password } = credentials;

        let pool;
        try {
          // Connect to the database
          pool = await connectToDB();
          console.log(cnic);

          // Query the database to find the user
          const result = await pool
            .request()
            .input("cnic", sql.VarChar, cnic)
            .input("password", sql.VarChar, encrypt(password))
            .query(
              "SELECT * FROM Users WHERE CNICNo = @cnic AND UserPassword = @password"
            );

          // Check if user exists
          if (result.recordset.length > 0) {
            const user = result.recordset[0];
            return {
              id: user.UserName,
              name: user.UserName,
            }; // Return user object for session
          } else {
            throw new Error("Invalid username or password");
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
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };
