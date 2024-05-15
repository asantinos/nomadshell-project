import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@pages/Home";
import SignIn from "@pages/auth/SignIn";
import SignUp from "@pages/auth/SignUp";
import Map from "@pages/Map";
import Profile from "@pages/Profile";
import Settings from "@pages/Profile/Settings";
import AddHome from "@pages/Profile/Homes/Add";
import Pricing from "@pages/Pricing";
import NotFound from "@pages/error/404.jsx";

import PrivateRoute from "@components/PrivateRoute";
import PremiumRoute from "@components/PremiumRoute";

import Header from "@components/Header";

function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/map" element={<Map />} />
                <Route path="/pricing" element={<Pricing />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/settings" element={<Settings />} />
                </Route>

                <Route element={<PremiumRoute />}>
                    <Route
                        path="/profile/homes/add"
                        element={<AddHome />}
                    />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
