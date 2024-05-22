import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { persistor, store } from "@redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import StripeContext from "@context/StripeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <NextUIProvider>
                <StripeContext>
                    <App />
                </StripeContext>
            </NextUIProvider>
        </PersistGate>
    </Provider>
);
