"use client";
import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

const AdminLogin = () => {
  return (
    <AuthLayout
      title="KSVJ - Admin Login"
      subtitle="Welcome back!"
    >
      <LoginForm isAdmin={true} />
    </AuthLayout>
  );
};

export default AdminLogin;

