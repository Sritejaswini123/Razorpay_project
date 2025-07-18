import React, { useEffect, useState } from "react";
import SubscribeButton from "./SubscribeButton";

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:7000/v1.0/get-plans");
        const data = await res.json();
        console.log("Fetched plans:", data);

        if (Array.isArray(data.plans)) {
          setPlans(data.plans);
        } else {
          console.error("Invalid plans data:", data);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return <div className="p-4 text-center text-lg">Loading plans...</div>;

  return (
    <div className="max-w-full mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Available Plans</h1>
      <div className="flex flex-row space-x-6 overflow-x-auto pb-4">
        {plans.map((plan) => (
          <div
            key={plan.razorpayPlanId}
            className="
              bg-white
              border
              rounded-2xl
              shadow
              hover:shadow-xl
              hover:bg-gray-50
              transition
              duration-200
              p-6
              flex-shrink-0
              w-80
              flex
              flex-col
              justify-between
              items-center
            "
          >
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2 text-gray-800">{plan.name}</h2>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <p className="text-gray-900 font-extrabold text-2xl">
                {plan.currency.toUpperCase()} {plan.amount / 100}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                / {plan.interval} {plan.period}
              </p>
            </div>
            <div className="mt-6 w-full">
              <SubscribeButton planId={plan.razorpayPlanId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage;
