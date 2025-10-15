import "./App.css";
import { AuthProvider } from './hooks/useAuth'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from './components/auth/LoginForm'
import SignUpForm from './components/auth/SignUpForm'
import UserProfile from './components/profile/UserProfile'
import ProductListingForm from './components/ListProductForm.jsx'
import UserProductListings from './components/products/UserProductListings'
import ProductPage from './components/ProductPage'
import ProductDetailPage from './components/ProductPage'
import ProductsListingPage from './components/ProductsListingPage'
import ProductReview from './components/ProductReview'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="">
          <Routes>

            {/*<Route path="/sokoni" element={<Markets />} />*/}
            <Route path="/" element={<ProductsListingPage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/list-product" element={<ProductListingForm />} />
            <Route path="/products/:token/review" element={<ProductReview />} />          {/* <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
