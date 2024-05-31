import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@pages/Home";
import SignIn from "@pages/auth/SignIn";
import SignUp from "@pages/auth/SignUp";
import Homes from "@pages/Homes";
import HomeView from "@pages/Homes/HomeView";
import ProfileView from "@pages/Homes/ProfileView";
import Map from "@pages/Map";
import Pricing from "@pages/Pricing";
import Profile from "@pages/Profile";
import Settings from "@pages/Profile/Settings";
import Dashboard from "@pages/admin/Dashboard";
import Favorites from "@pages/Favorites";
import AddHome from "@pages/Profile/Homes/Add";
import EditHome from "@pages/Profile/Homes/Edit";
import NotFound from "@pages/error/404.jsx";
import Terms from "@pages/Terms";

import AdminCreateHome from "@pages/admin/Dashboard/Homes/Add";

import PrivateRoute from "@components/Routes/PrivateRoute";
import PremiumRoute from "@components/Routes/PremiumRoute";
import AdminRoute from "@components/Routes/AdminRoute";

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
                <Route path="/homes/:id" element={<HomeView />} />
                <Route path="/users/:id" element={<ProfileView />} />
                <Route path="/map" element={<Map />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/terms" element={<Terms />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/settings" element={<Settings />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Route>

                <Route element={<PremiumRoute />}>
                    <Route path="/profile/homes/add" element={<AddHome />} />
                    <Route
                        path="/profile/homes/edit/:id"
                        element={<EditHome />}
                    />
                </Route>

                <Route element={<AdminRoute />}>
                    <Route path="/dashboard/:section" element={<Dashboard />} />
                    <Route
                        path="/dashboard/homes/add"
                        element={<AdminCreateHome />}
                    />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
