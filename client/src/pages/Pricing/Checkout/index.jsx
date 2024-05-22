// CheckoutForm.js
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { clientSecret } = await axios.post("/api/payment/create-payment-intent");

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: cardElement,
                },
            }
        );

        if (error) {
            setError(`Payment failed: ${error.message}`);
        } else if (paymentIntent.status === "succeeded") {
            setSuccess(true);
        }
    };

    return (
        <div className="pt-header z-50">
            <div className="max-w-2xl mx-auto p-6">
                <h3 className="text-4xl font-bold">Checkout</h3>
                <form
                    className="mt-6"
                    onSubmit={handleSubmit}
                    style={{ maxWidth: "400px" }}
                >
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": {
                                        color: "#aab7c4",
                                    },
                                },
                                invalid: {
                                    color: "#9e2146",
                                },
                            },
                        }}
                    />
                    <button
                        type="submit"
                        className="w-full bg-gray-dark hover:bg-black text-white font-medium rounded-full py-3 mt-8 transition duration-200 ease-in-out"
                    >
                        Pay $20
                    </button>
                    {error && (
                        <div className="text-red-500 text-sm mt-4">{error}</div>
                    )}
                    {success && (
                        <div className="text-green-500 text-sm mt-4">
                            Payment succeeded!
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CheckoutForm;
