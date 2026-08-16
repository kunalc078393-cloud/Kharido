import { useDispatch } from "react-redux";
import { refresh, getMe, setInitialized} from "../store/slices/authSlice";
import { useEffect, useRef } from "react";
import { getCart } from "../store/slices/cartSlice";

function AuthInitializer() {
    const dispatch = useDispatch();

    const initialized = useRef(false);

    useEffect(() => {

        if (initialized.current) return;

        initialized.current = true;
        console.log("🔥 AuthInitializer effect running");

        const initializeAuth = async () => {

            try {
                console.log("🔥 Calling refresh");
                await dispatch(refresh()).unwrap();
                console.log("🔥 Calling getMe");
                await dispatch(getMe()).unwrap();
                console.log("calling getCart");
                await dispatch(getCart()).unwrap();

            } catch (error) {
                console.log("🔥 No existing authentication session");


            }finally{
                dispatch(setInitialized());
            }
        }
        initializeAuth();

    }, [dispatch])

    return null;
}

export default AuthInitializer;