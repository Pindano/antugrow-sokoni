// components/ProtectedRoutes.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";
import { FullPageLoader } from "../components/LoadingSkeleton";
const ProtectedRoutes = () => {
    const { userProfile, loadingUserProfile } = useUserContext();

    const location = useLocation();

    if (loadingUserProfile) {
        return <FullPageLoader />;
    }

    if (!userProfile) {
        return (
            <Navigate to="/login" replace state={{ from: location.pathname }} />
        );
    }

    return <Outlet />;
};

export default ProtectedRoutes;
