import "./App.css";
import { AuthProvider } from "./hooks/useAuth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import UserProfile from "./components/profile/UserProfile";
import ProductListingForm from "./components/ListProductForm.jsx";
import UserProductListings from "./components/products/UserProductListings";
import ProductPage from "./components/ProductPage";
import ProductDetailPage from "./components/ProductPage";
import ProductsListingPage from "./components/ProductsListingPage";
import ProductReview from "./components/ProductReview";
import { ProductProvider } from "./providers/ProductProvider.jsx";
import Cart from "./components/Cart.jsx";
import SiteFooter from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";
import OrdersPage from "./components/Orders.jsx";
import ProtectedRoutes from "./protected-routes/ProtectedRoutes.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import { UserProvider } from "./providers/UserProvider.jsx";
function App() {
    return (
        <AuthProvider>
            {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
            <Toaster position="top-center" reverseOrder={false} />
            <UserProvider>
                <ProductProvider>
                    <BrowserRouter>
                        <div className="">
                            <Routes>
                                <Route
                                    path="/"
                                    element={<ProductsListingPage />}
                                />
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/products/:productId"
                                    element={<ProductPage />}
                                />
                                <Route path="/cart" element={<Cart />} />
                                {/* <Route path="/orders" element={<OrdersPage />} /> */}
                                <Route
                                    path="/list-product"
                                    element={<ProductListingForm />}
                                />
                                <Route
                                    path="/products/:token/review"
                                    element={<ProductReview />}
                                />

                                {/* Protected Routes */}
                                <Route element={<ProtectedRoutes />}>
                                    <Route
                                        path="/orders"
                                        element={<OrdersPage />}
                                    />
                                    <Route
                                        path="/profile"
                                        element={<Profile />}
                                    />
                                </Route>
                            </Routes>
                        </div>
                    </BrowserRouter>
                </ProductProvider>
            </UserProvider>
        </AuthProvider>
    );
}

export default App;
