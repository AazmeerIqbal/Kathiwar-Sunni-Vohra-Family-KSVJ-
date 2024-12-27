"use client";
import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AuthLayout
      title={
        isLogin
          ? `KSVJ - ${isAdmin ? "Admin" : "User"} Login`
          : "Create Account"
      }
      subtitle={
        isLogin
          ? `Welcome back! Please enter your details to ${
              isAdmin ? "manage your dashboard" : "access your account"
            }.`
          : "Fill in the information below to create your account."
      }
    >
      {isLogin ? (
        <>
          <LoginForm
            isAdmin={isAdmin}
            onToggleMode={() => setIsAdmin(!isAdmin)}
          />
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              className="text-blue-600 hover:text-blue-500 font-medium"
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
          </p>
        </>
      ) : (
        <>
          <SignupForm />
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              className="text-blue-600 hover:text-blue-500 font-medium"
              onClick={() => setIsLogin(true)}
            >
              Sign in
            </button>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default Login;
