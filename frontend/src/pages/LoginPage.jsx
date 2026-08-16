import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { Link } from "react-router-dom"


function LoginPage() {
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated , user} = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [fieldErrors, setFieldErrors] = useState({
        email: { error: false, message: "" },
        password: { error: false, message: "" }
    });

    const validateField = (name, value) => {
        let error = false;
        let message = "";

        if (name === "email") {
            if (!value) {
                error = true;
                message = "Email can't be empty";
            } else if (!value.includes("@") || !value.includes(".")) {
                error = true;
                message = "Invalid email format";
            }
        }

        if (name === "password") {
            if (!value) {
                error = true;
                message = "Password can't be empty";
            } else if (value.length < 6) {
                error = true;
                message = "Password must be at least 8 characters long";
            }
        }

        setFieldErrors((prev) => ({
            ...prev,
            [name]: { error, message }
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        validateField(name, value);

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        validateField("email", formData.email);
        validateField("password", formData.password);

        if (fieldErrors.email.error || fieldErrors.password.error || !formData.email || !formData.password) {
            return;
        }



        const data = await dispatch(login(formData)).unwrap();

        console.log("LOGIN SUCCESS:", data); 
        console.log("AUTH AFTER LOGIN:", {
            isAuthenticated,
            user
        });


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#eaeaea]">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-[#8ba0a4]"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-[#183e4b]">
                    Login
                </h2>

                {/* Email */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-[#1b4552]">
                        Email
                    </label>

                    <input
                        type="text"
                        name="email"
                        autoFocus
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded border 
                            ${fieldErrors.email.error
                                ? "border-[#d74a49] bg-red-50"
                                : "border-[#8ba0a4] bg-white"
                            }
                            focus:outline-none focus:ring-2 focus:ring-[#1b4552]
                        `}
                    />

                    {fieldErrors.email.error && (
                        <p className="text-[#d74a49] text-sm mt-1">
                            {fieldErrors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-[#1b4552]">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded border 
                            ${fieldErrors.password.error
                                ? "border-[#d74a49] bg-red-50"
                                : "border-[#8ba0a4] bg-white"
                            }
                            focus:outline-none focus:ring-2 focus:ring-[#1b4552]
                        `}
                    />

                    {fieldErrors.password.error && (
                        <p className="text-[#d74a49] text-sm mt-1">
                            {fieldErrors.password.message}
                        </p>
                    )}
                </div>

                {/* Redux Error */}
                {error && (
                    <p className="text-[#d74a49] text-center mb-4 font-medium">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded text-white font-semibold bg-[#d74a49] hover:bg-[#1b4552] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : "Login"}
                </button>
                {/* Register Link */}
                <p className="mt-4 text-center text-sm text-[#1b4552]">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-[#d74a49] hover:text-[#1b4552] font-medium">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
