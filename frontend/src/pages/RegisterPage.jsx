import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/slices/authSlice";
import { Link } from "react-router-dom";

function RegisterPage() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const [fieldErrors, setFieldErrors] = useState({
        fullName: {
            error: false,
            message: ""
        },
        email: {
            error: false,
            message: ""
        },
        password: {
            error: false,
            message: ""
        }
    })

    const validate = (name, value) => {
        let message = "";
        let error = false;

        if (name == "fullName") {
            if (!value) {
                error = true;
                message = "Name can't be empty"
            }
        }
        if (name == "email") {
            if (!value) {
                error = true;
                message = "email can't be empty";
            }else if (!value.includes('@') || !value.includes('.')) {
                error = true;
                message = "Invalid email";
            }
        }
        if (name == "password") {
            if (!value) {
                error = true;
                message = "Password can't be empty";
            }else if (value.length < 8) {
                error = true;
                message = "Passwort must be 8 character long";

            }

        }

        setFieldErrors((prev) => ({
            ...prev,
            [name]: { error, message }

        }))


    }

    const handleChange = (e) => {
        const {name, value} = e.target
        validate(name, value);

        setFormData((prev) => ({
            ...prev,
            name : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        validate("fullName",  formData.fullName)
        validate("email", formData.email);
        validate("password", formData.password);

        if (fieldErrors.email.error || fieldErrors.password.error || !formData.email || !formData.password) {
            return;
        }

        dispatch(register());



    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-[#eaeaea]">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-[#8ba0a4]"
                >
                    <h2 className="text-2xl font-bold text-center mb-6 text-[#183e4b]">
                        Register
                    </h2>

                    {/* Full Name */}
                    <div className="mb-4">
                        <label htmlFor="full-name" className="block mb-1 font-medium text-[#1b4552]">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="full-name"
                            name="fullName"
                       
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded border ${fieldErrors.fullName.error ? "border-[#d74a49] bg-red-50" : "border-[#8ba0a4]"}focus:outline-none focus:ring-2 focus:ring-[#1b4552]`}
                        />
                        {fieldErrors.fullName.error && (
                            <p className="text-[#d74a49] text-sm mt-1">{fieldErrors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 font-medium text-[#1b4552]">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"

                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded border ${fieldErrors.email.error ? "border-[#d74a49] bg-red-50" : "border-[#8ba0a4]"}focus:outline-none focus:ring-2 focus:ring-[#1b4552]`}
                        />
                        {fieldErrors.email?.error && (
                            <p className="text-[#d74a49] text-sm mt-1">{fieldErrors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1 font-medium text-[#1b4552]">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            className={`w-full px-4 py-2 rounded border ${fieldErrors.password?.error ? "border-[#d74a49] bg-red-50" : "border-[#8ba0a4]"}focus:outline-none focus:ring-2 focus:ring-[#1b4552]`}
                        />
                        {fieldErrors.password.error && (
                            <p className="text-[#d74a49] text-sm mt-1">{fieldErrors.password.message}</p>
                        )}
                    </div>

                    {/* Global Error */}
                    {error && (
                        <p className="text-[#d74a49] text-center mb-4 font-medium">{error}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"

                        className="w-full py-2 rounded text-white font-semibold bg-[#d74a49] hover:bg-[#1b4552] transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    {/* Navigation to Login */}
                    <p className="mt-4 text-center text-sm text-[#1b4552]">
                        Already have an account?{" "}
                        <Link to="/register" className="text-[#d74a49] hover:text-[#1b4552] font-medium">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>

        </>
    );
}


export default RegisterPage;