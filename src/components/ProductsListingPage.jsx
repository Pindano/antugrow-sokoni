import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import {
    Search,
    ShoppingCart,
    Phone,
    Mail,
    MapPin,
    Loader2,
} from "lucide-react";
import { Navigation } from "./Navigation";
import { Link } from "react-router-dom";
import { useProductContext } from "../providers/ProductProvider";
import { Trash } from "lucide-react";
import WelcomeHeader from "./WelcomePage";
import SiteFooter from "./Footer";

// Define the number of skeletons to show while loading
const SKELETON_COUNT = 9;

function ProductSkeleton() {
    return (
        <Card className="py-0 transition-all duration-200 bg-white h-full flex flex-col animate-pulse">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-200">
                {/* Image area */}
            </div>

            <div className="flex flex-col flex-1 p-4">
                {/* Title Placeholder */}
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>

                {/* Description Placeholder */}
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3 flex-1"></div>

                <div className="space-y-3">
                    {/* Price Placeholder */}
                    <div className="h-6 bg-green-200 rounded w-1/2"></div>

                    {/* Badges Placeholder */}
                    <div className="flex flex-wrap gap-1">
                        <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Button Placeholder */}
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>
            </div>
        </Card>
    );
}

export default function ProductsListingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const {
        products,
        loadingProducts: loading,
        error,
        fetchProducts,
        sendReminderEmail,
        addProductToCart,
        increaseQuantity,
        decreaseQuantity,
        removeProductFromCart,
        cartItems,
        MIN_QTY,
    } = useProductContext();

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.short_description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
            <Navigation />

            <WelcomeHeader />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Products Grid */}
                <div className="mb-8">
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6">
                            {/* Render multiple skeletons based on SKELETON_COUNT */}
                            {Array.from({ length: SKELETON_COUNT }).map(
                                (_, index) => (
                                    <ProductSkeleton key={index} />
                                )
                            )}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 text-lg mb-4">{error}</p>
                            <Button
                                onClick={fetchProducts}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchTerm
                                    ? "No products found matching your search."
                                    : "No products available at the moment."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/products/${product.id}`}
                                >
                                    <Card className="group cursor-pointer hover:shadow-xl py-0 transition-all duration-200 bg-white h-full flex flex-col">
                                        {/* ... Image Section (Same as before) ... */}
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                                            <img
                                                src={
                                                    product.images?.[0] ||
                                                    "/placeholder.svg"
                                                }
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {!product.inStock && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-red-100 text-red-800"
                                                    >
                                                        Out of Stock
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-1 px-4 pb-4">
                                            {/* ... Title and Description (Same as before) ... */}
                                            <div className="flex justify-between items-start mb-2">
                                                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                                                    {product.name}
                                                </CardTitle>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-1">
                                                {product.short_description}
                                            </p>

                                            <div className="space-y-2 mt-auto">
                                                <div className="text-xl font-bold text-green-600">
                                                    KSh{" "}
                                                    {product.price.toLocaleString()}
                                                    <span className="text-sm font-normal text-gray-500 ml-1">
                                                        per {product.unit}
                                                    </span>
                                                </div>

                                                {/* ... Badges (Same as before) ... */}
                                                {/* <div className="flex flex-wrap gap-1">
                                                    {product.badges
                                                        ?.slice(0, 2)
                                                        .map((badge, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {badge}
                                                            </Badge>
                                                        ))}
                                                </div> */}

                                                {/* --- MODIFIED SECTION STARTS HERE --- */}
                                                {product.inStock ? (
                                                    (() => {
                                                        // Note: The structure of cartItems should be [{ product: { id }, quantity: N }, ...]
                                                        const cartItem =
                                                            cartItems.find(
                                                                (item) =>
                                                                    item.product
                                                                        .id ===
                                                                    product.id
                                                            );

                                                        // Get quantity, defaulting to 0 if not found
                                                        const quantityInCart =
                                                            cartItem
                                                                ? cartItem.quantity
                                                                : 0;

                                                        // Remove the console.log from the final production code
                                                        // console.log(cartItem);

                                                        // ----------------------------------------------------------------------
                                                        // Conditional Rendering based on whether the item is in the cart
                                                        // ----------------------------------------------------------------------

                                                        return quantityInCart >
                                                            0 ? ( // Check quantityInCart > 0 instead of just cartItem
                                                            // OPTION A: Item is in Cart -> Show Quantity Controls & Remove Button
                                                            <div className="flex items-center w-full h-10 gap-2">
                                                                {/* ------------------------------------------------------ */}
                                                                {/* QUANTITY STEPPER (Main Control) */}
                                                                {/* ------------------------------------------------------ */}
                                                                <div
                                                                    className="flex items-center justify-between h-10 bg-green-50 border border-green-600 rounded-md overflow-hidden flex-1 min-w-[150px]"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        // Critical: Prevent Link navigation when clicking the empty space in this div
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                    }}
                                                                >
                                                                    {/* LEFT BUTTON: DECREMENT (-) */}
                                                                    <button
                                                                        // Disabled if at minimum quantity (MIN_QTY = 5)
                                                                        disabled={
                                                                            quantityInCart <=
                                                                            MIN_QTY
                                                                        }
                                                                        className={`h-full px-3 transition-colors flex items-center justify-center border-r border-green-200 
                        ${
                            quantityInCart <= MIN_QTY
                                ? "text-gray-400 cursor-not-allowed" // Disabled state
                                : "text-green-700 hover:bg-green-100" // Active state
                        }`}
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();

                                                                            // Action: Decrease Quantity (only if above the minimum)
                                                                            if (
                                                                                quantityInCart >
                                                                                MIN_QTY
                                                                            ) {
                                                                                decreaseQuantity(
                                                                                    product.id
                                                                                );
                                                                            }
                                                                        }}
                                                                        title={`Decrease quantity (Min ${MIN_QTY} kgs)`}
                                                                    >
                                                                        <Minus className="w-4 h-4" />
                                                                    </button>

                                                                    {/* CENTER: QUANTITY DISPLAY (with minimum warning) */}
                                                                    <Link
                                                                        to={`/products/${product.id}`}
                                                                        className="font-bold text-green-800 text-sm whitespace-nowrap px-2 w-full h-full text-center flex justify-center items-center"
                                                                    >
                                                                        {
                                                                            quantityInCart
                                                                        }{" "}
                                                                        kgs in
                                                                        cart{" "}
                                                                        {quantityInCart ===
                                                                            MIN_QTY && (
                                                                            <span className="ml-1 text-xs font-normal text-gray-500">
                                                                                (Min)
                                                                            </span>
                                                                        )}
                                                                    </Link>

                                                                    {/* RIGHT BUTTON: INCREMENT (+) */}
                                                                    <button
                                                                        className="h-full px-3 text-green-700 hover:bg-green-200 transition-colors flex items-center justify-center border-l border-green-200"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            // Action: Increase Quantity
                                                                            increaseQuantity(
                                                                                product.id
                                                                            );
                                                                        }}
                                                                        title="Increase quantity"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                                {/* ------------------------------------------------------ */}
                                                                {/* DEDICATED REMOVE BUTTON (TRASH) */}
                                                                {/* ------------------------------------------------------ */}
                                                                <button
                                                                    className="cursor-pointer h-10 w-10 flex items-center justify-center text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors shrink-0"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        // Action: Remove Item
                                                                        removeProductFromCart(
                                                                            product.id
                                                                        );
                                                                    }}
                                                                    title="Remove item completely"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            // OPTION B: Item NOT in Cart -> Show Add Button
                                                            <Button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    addProductToCart(
                                                                        product
                                                                    );
                                                                }}
                                                                className="w-full bg-green-600 hover:bg-green-700 group-hover:bg-green-700 cursor-pointer transition-colors"
                                                            >
                                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                                Add to Cart
                                                            </Button>
                                                        );
                                                    })()
                                                ) : (
                                                    // Out of Stock Button
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-dashed text-gray-700 hover:bg-gray-50"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            sendReminderEmail(
                                                                product.id
                                                            );
                                                        }}
                                                    >
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        Remind Me
                                                    </Button>
                                                )}
                                                {/* --- MODIFIED SECTION ENDS HERE --- */}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
