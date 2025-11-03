"use client";
import React, { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import SignupOptionsModal from "@/components/auth/SignupOptionsModal";

const Login = () => {
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
          ? `KSVJ - Member Login`
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
          <LoginForm isAdmin={false} />
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                onClick={() => setIsModalOpen(true)}
              >
                Sign up
              </button>
            </p>
          </div>
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
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </button>
            </p>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default Login;
