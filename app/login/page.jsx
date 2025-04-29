"use client";
import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import SignupOptionsModal from "@/components/auth/SignupOptionsModal";

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewRegistration = () => {
    setIsModalOpen(false);
    window.location.href = "/register-user";
  };

  const handleSignup = () => {
    setIsModalOpen(false);
    setIsLogin(false);
  };

  return (
    <AuthLayout
      title={
        isLogin
          ? `KSVJ - ${isAdmin ? "Admin" : "Member"} Login`
          : "Create Account"
      }
      subtitle={
        isLogin
          ? `Welcome back!`
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
              onClick={() => setIsModalOpen(true)}
            >
              Sign up
            </button>
          </p>
          <SignupOptionsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onNewRegistration={handleNewRegistration}
            onSignup={handleSignup}
          />
        </>
      ) : (
        <>
          <SignupForm setIsLogin={setIsLogin} />
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
