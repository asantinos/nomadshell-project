import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@pages/Home";
import SignIn from "@pages/auth/SignIn";
import SignUp from "@pages/auth/SignUp";
import Homes from "@pages/Homes";
import Map from "@pages/Map";
import Pricing from "@pages/Pricing";
import Profile from "@pages/Profile";
import Settings from "@pages/Profile/Settings";
import AddHome from "@pages/Profile/Homes/Add";
import EditHome from "@pages/Profile/Homes/Edit";
import NotFound from "@pages/error/404.jsx";

import PrivateRoute from "@components/PrivateRoute";
import PremiumRoute from "@components/PremiumRoute";

import Header from "@components/Header";
import GoToTop from "@components/GoToTop";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <GoToTop />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/homes" element={<Homes />} />
                <Route path="/map" element={<Map />} />
                <Route path="/pricing" element={<Pricing />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/settings" element={<Settings />} />
                </Route>

                <Route element={<PremiumRoute />}>
                    <Route path="/profile/homes/add" element={<AddHome />} />
                    <Route
                        path="/profile/homes/edit/:id"
                        element={<EditHome />}
                    />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
