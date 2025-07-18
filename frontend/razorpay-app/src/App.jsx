import { useState } from "react";
import PaymentCard from "./paymentCard";
import PlansPage from "./components/PlansPage";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
  <h1> Welcome to Razorpay Payment</h1>
     <PlansPage/>
    </div>
  );
}
export default App;
