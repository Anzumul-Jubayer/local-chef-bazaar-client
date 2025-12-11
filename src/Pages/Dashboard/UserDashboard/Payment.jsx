import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";

const stripePromise = loadStripe(
  "pk_test_51SVjUBGvpCLGFhd55NSrZSScTORCE1SL0t28y4XSvmiev1acqMBcyGOncMHGAFWp3Vbbtalww66Gt0jsROG65vik00ngFzctgC"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const orderId = localStorage.getItem("currentOrderId");
  const amount = localStorage.getItem("currentOrderAmount");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      const res = await fetch("http://localhost:3000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(Number(amount) * 100) }),
      });

      if (!res.ok) throw new Error("Failed to create payment intent");
      const { clientSecret } = await res.json();

      const card = elements.getElement(CardElement);

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card },
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");

        await fetch(`http://localhost:3000/orders/${orderId}/payment`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentInfo: paymentIntent }),
        });

        navigate("/dashboard/payment-success");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed!");
    }
  };

  return (
    <>
    <Helmet>
      <title>Payment | LocalChefBazar</title>
    </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-neutral text-white">
        <form
          className="bg-neutral/80 p-8 rounded-xl w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Pay ${amount}</h2>
          <div className="bg-gray-700 p-4 rounded mb-6">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
          <button
            type="submit"
            disabled={!stripe || !amount || !orderId}
            className="w-full py-2 bg-green-600 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            Pay Now
          </button>
        </form>
      </div>
    </>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Payment;
