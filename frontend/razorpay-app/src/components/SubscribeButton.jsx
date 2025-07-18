import React, { useState } from "react";

const SubscribeButton = ({ planId }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Replace with actual customer_id from your auth/user context
      const customer_id = "cust_QqutVOvuwnzkIJ";
      const plan_id = "plan_QqsSS9w1siPsBP"

      const res = await fetch("http://localhost:7000/v1.0/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id,
            plan_id,
          total_count: 12,
          quantity: 1,auth_type: "card", 
        }),
      });

      const data = await res.json();
      console.log("Subscription creation response:", data);

      if (data.subscription && data.subscription.id) {
        const subscriptionId = data.subscription.id;
        openRazorpayCheckout(subscriptionId);
      } else {
        alert("Failed to create subscription. Please try again.");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      alert("Error creating subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = (subscriptionId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // securely load from .env
      subscription_id: subscriptionId,
      name: "Tezz App",
      description: "Monthly Subscription",
      handler: function (response) {
        console.log("Payment success:", response);
        alert("Payment successful! Subscription active.");
        // Optionally POST response.razorpay_payment_id, response.razorpay_subscription_id, response.razorpay_signature to backend for verification
      },
      prefill: {
        name: "Sri Tejaswini",
        email: "sri@example.com",
        contact: "9876543210",
      },
      theme: { color: "#6366f1" },
        method: {
    netbanking: false,
    card: true,
    upi: true,
    wallet: false,
  },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`w-full rounded-lg px-4 py-2 font-semibold text-white ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700"
      } transition`}
    >
      {loading ? "Processing..." : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;
