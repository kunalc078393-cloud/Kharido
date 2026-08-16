import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import api from "./services/api.js";
import LoginPage from "./pages/LoginPage.jsx";
import Registerpage from "./pages/RegisterPage.jsx";
import AuthInitializer from "./components/AuthInitializer.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import PublicRoute from "./components/routes/PublicRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import OrderPage from "./pages/OrderPage.jsx";

function App() {





  return (
    <BrowserRouter>
      <AuthInitializer />

      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/products"
            element={<ProductsPage />}
          />
          <Route
            path="/products/:id"
            element={<ProductDetailsPage />}
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/cart"
              element={<CartPage />}
            />
            <Route
              path="/profile"
              element = {<UserProfilePage/>}
            />
            <Route
              path="/checkout"
              element = {<OrderPage/>}
            
            />

          </Route>

        </Route>

        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/register"
            element={<Registerpage />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App
