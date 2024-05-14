import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PremiumRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser && currentUser.user.planType !== "free" ? (
        <Outlet />
    ) : (
        <Navigate to="/profile" />
    );
};

export default PremiumRoute;
