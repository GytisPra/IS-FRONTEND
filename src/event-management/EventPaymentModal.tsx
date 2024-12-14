// EventModal.tsx
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
interface EventPaymentModalProps {
  onClose: () => void;
}
const stripePromise = loadStripe(
  "pk_test_51QVayNKiZUiFkcXdjNeg7uQI36BfXD1p1ubkgqeGA0cMKfkBdiQJCiQx3G1HuK1nBqRCWCoGNBebHvO1nmAxiItE00EZI9OsEV"
);

const EventPaymentModal: React.FC<EventPaymentModalProps> = ({ onClose }) => {
  const options = {
    mode: "payment",
    amount: 1090,
    currency: "usd",
    appearance: {
      theme: "stripe",
    },
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Apmokėti</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="m-4">
          <Elements stripe={stripePromise} options={options}>
            <form>
              <PaymentElement />
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Atšaukti
              </button>
              <button
                type="submit"
                className="mr-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Patvirtinti
              </button>
            </form>
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default EventPaymentModal;
