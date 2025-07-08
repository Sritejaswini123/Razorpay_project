import "./PaymentCard.css";
import { useState } from "react";

function PaymentCard() {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount before proceeding.");
      return;
    }

    try {
      //  Create Razorpay order on backend
      const res = await fetch("http://localhost:7000/v1.0/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseInt(amount),
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!data.order) {
        alert("Failed to create order");
        return;
      }
      const { id: order_id, amount: orderAmount, currency } = data.order;

      //  Dynamically load Razorpay
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderAmount,
          currency,
          name: "Tez Razorpay",
          description: "Transaction",
          order_id,
          async handler(response) {
            const verifyRes = await fetch("http://localhost:7000/v1.0/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Payment Successful!");
            }
            else {
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: "Tejaswini",
            email: "tejaswini@gmail.com",
            contact: "69876543210",
          },
          notes: {
            address: "hyderabad",
          },
          theme: {
            color: "#0d9488",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);
    }
    catch (error) {
      console.error(error);
      alert("Error during payment initialization.");
    }
  };

  return (
    <div className="payment-card">
      <h3>Pay Amount</h3>
      <label>Enter Amount (₹):</label>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>PAY NOW</button>
    </div>
  );
}

export default PaymentCard;
