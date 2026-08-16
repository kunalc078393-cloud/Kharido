import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Loading";



function ProtectedRoute() {
    const { isAuthenticated, initialized, user, accessToken } = useSelector((state) => state.auth);
    console.log("  ProtectedRoute:", {
        isAuthenticated,
        user,
        accessToken
    });

    if (!initialized) {
        return <Loading />
    }
    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }

    return <Outlet />;
}

export default ProtectedRoute;