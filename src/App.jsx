import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsListingPage from "./components/ProductsListingPage.jsx";
import ProductPage from "./components/ProductPage.jsx";
import ListProductForm from "./components/ListProductForm.jsx";
import ProductReview from "./components/ProductReview.jsx";



function App() {
  return (
    <BrowserRouter>
      <div className="">
        <Routes>
          
          {/*<Route path="/sokoni" element={<Markets />} />*/}
          <Route path="/" element={<ProductsListingPage />} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/list-product" element={<ListProductForm />} />
          <Route path="/products/:token/review" element={<ProductReview />} />          {/* <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
