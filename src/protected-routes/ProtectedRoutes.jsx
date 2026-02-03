// components/ProtectedRoutes.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";

const ProtectedRoutes = () => {
    const { userProfile, loadingUserProfile } = useUserContext();

    const location = useLocation();

    if (loadingUserProfile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <Navigate to="/login" replace state={{ from: location.pathname }} />
        );
    }

    return <Outlet />;
};

export default ProtectedRoutes;
