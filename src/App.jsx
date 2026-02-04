import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductListingForm from "./components/ListProductForm.jsx";
import ProductPage from "./components/ProductPage";
import ProductsListingPage from "./components/ProductsListingPage";
import ProductReview from "./components/ProductReview";
import { ProductProvider } from "./providers/ProductProvider.jsx";
import Cart from "./components/Cart.jsx";
import { Toaster } from "react-hot-toast";
import OrdersPage from "./components/Orders.jsx";
import ProtectedRoutes from "./protected-routes/ProtectedRoutes.jsx";
import Login from "./components/Login.jsx";
import Profile from "./components/Profile.jsx";
import { UserProvider } from "./providers/UserProvider.jsx";
function App() {
    return (
        <>
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
        </>
    );
}

export default App;
