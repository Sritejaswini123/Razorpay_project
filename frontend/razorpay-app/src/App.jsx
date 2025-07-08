import { useState } from "react";
import PaymentCard from "./paymentCard";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
  <h1> Welcome to Razorpay Payment</h1>
  <PaymentCard />
    </div>
  );
}
export default App;
