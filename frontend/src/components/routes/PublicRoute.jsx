import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Loading";

function PublicRoute() {
    const { isAuthenticated, initialized } = useSelector(
        (state) => state.auth
    )
    if (!initialized) {
        return <Loading />
    }
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default PublicRoute;