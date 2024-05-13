import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
// import SignIn from "./pages/SignIn.jsx";
// import SignUp from "./pages/SignUp.jsx";
// import Profile from "./pages/Dashboard.jsx";
import NotFound from "./pages/error/404.jsx";

import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";

function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} /> */}

                <Route element={<PrivateRoute />}>
                    {/* <Route path="/profile" element={<Profile />} /> */}
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
