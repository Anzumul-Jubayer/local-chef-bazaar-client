import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <>
     <Helmet>
      <title>Payment Success | LocalChefBazar</title>
    </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral text-white">
        <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
        <p className="mb-6">Thank you for your payment.</p>
        <button
          className="px-6 py-2 bg-primary rounded-lg hover:bg-[#b9932c]"
          onClick={() => navigate("/dashboard/orders")}
        >
          Back to Orders
        </button>
      </div>
    </>
  );
};

export default PaymentSuccess;
