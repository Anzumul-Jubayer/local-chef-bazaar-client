// src/Pages/ErrorPage.jsx
import React from "react";
import { Link } from "react-router";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-[#1A1A1A] to-[#111111] px-4">
      <h1 className="text-9xl font-bold text-primary mb-6">404</h1>
      <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
        Oops! Something went wrong
      </h2>
      <p className="text-soft-gray mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or an unexpected error occurred.
        Please try again or return to the homepage.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary text-neutral rounded-lg font-semibold hover:bg-[#b9932c] transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Error;
