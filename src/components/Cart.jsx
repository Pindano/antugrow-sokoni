import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "./Navigation";
import { useProductContext } from "../providers/ProductProvider";
import { Trash, ShoppingBag, ChevronLeft, Loader2 } from "lucide-react";
import CartSkeleton from "./cart-skeleton";
import { CheckoutModal } from "./checkout-modal";

// --- Mock Button Component (Preserved from original) ---
const Button = ({
    children,
    className,
    onClick,
    variant,
    size,
    disabled,
    loading,
    ...props
}) => {
    const baseStyle =
        "px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";
    let style = baseStyle;

    if (variant === "outline") {
        style = `${baseStyle} bg-white border border-gray-300 text-gray-700 hover:bg-gray-100`;
    } else if (variant === "ghost") {
        style = `${baseStyle} bg-transparent hover:bg-gray-100 text-gray-700 p-2`;
    } else {
        style = `${baseStyle} bg-green-600 text-white hover:bg-green-700 shadow-md`;
    }

    if (size === "lg") {
        style = `${style} text-lg px-6 py-3`;
    } else if (size === "icon") {
        style = `${style} w-10 h-10 p-0 flex items-center justify-center`;
    }

    return (
        <button
            className={`${style} ${className} ${
                disabled || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {children}
        </button>
    );
};

// --- Main Cart Component ---
export default function Cart() {
    // --- Mocking Context Logic for demonstration ---
    const {
        cartItems,
        MIN_QTY,
        removeProductFromCart,
        increaseQuantity,
        decreaseQuantity,
        products,
        loadingProducts,
        setQuantity,
    } = useProductContext();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const handleRemoveItem = (id) => {
        removeProductFromCart(id);
    };
    // ---------------------------------------------

    // Calculate Subtotal (sum of all item totals)
    // Note: Shipping is now calculated in the modal dynamically
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.product?.price * item?.quantity,
        0,
    );
    const itemsCount = cartItems?.length ?? 0;

    const BasketSummary = () => {
        // 1. Determine which cart items are currently available
        const availableItems = cartItems.filter((item) => {
            const itemStockData = products.find(
                (prod) => prod.id === item.product.id,
            );
            return (
                itemStockData &&
                itemStockData.inStock &&
                itemStockData.quantity >= item.quantity
            );
        });

        const availableSubtotal = availableItems.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0,
        );
        const availableCount = availableItems.length;

        // 3. Determine if Checkout should be disabled
        const hasUnavailableItems = cartItems.length !== availableItems.length;
        const isBasketEmpty = cartItems.length === 0;
        const canCheckout = !hasUnavailableItems && !isBasketEmpty;

        const checkoutMessage = isBasketEmpty
            ? "Basket is Empty"
            : hasUnavailableItems
              ? "Unavailable Items Found"
              : "Checkout";

        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 lg:sticky lg:top-20">
                <h2 className="text-xl font-bold mb-5 text-gray-900 border-b pb-3">
                    Harvest Summary
                </h2>

                <div className="space-y-3 pb-4 mb-4">
                    <div className="flex justify-between text-gray-700 text-sm">
                        <span>Produce Value ({availableCount} items)</span>
                        <span className="font-medium">
                            KES {availableSubtotal.toFixed(0)}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-xs italic">
                        <span>Delivery Fee</span>
                        <span>Calculated at checkout</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                    <span className="text-xl font-bold text-gray-900">
                        Subtotal
                    </span>
                    <span className="text-2xl font-extrabold text-green-700">
                        KES {availableSubtotal.toFixed(0)}
                    </span>
                </div>

                <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg rounded-xl transition duration-200 shadow-lg disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                    disabled={!canCheckout}
                    onClick={() => setIsCheckoutOpen(true)}
                >
                    {checkoutMessage}
                </Button>

                {/* <p className="text-xs text-gray-500 mt-4 text-center">
                    Secure Checkout Swypt
                </p> */}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cartTotal={subtotal}
                cartItems={cartItems}
            />

            {loadingProducts ? (
                <CartSkeleton />
            ) : (
                <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
                    <h1 className="text-4xl font-extrabold mb-2 text-gray-900 tracking-tight">
                        Your Basket
                    </h1>
                    <p className="text-md text-gray-600 mb-8">
                        Your basket has {itemsCount} items
                    </p>

                    {itemsCount === 0 ? (
                        <div className="text-center py-24 bg-white rounded-xl shadow-lg border border-gray-200 ">
                            <ShoppingBag className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <p className="text-gray-600 text-xl mb-6 font-semibold">
                                Your basket is light! Time to explore some fresh
                                produce.
                            </p>

                            <Link to="/" className="w-full flex justify-center">
                                <Button
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold transition-all"
                                >
                                    Start Shopping Now
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        // Cart Content
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Summary Column */}
                            <div className="lg:col-span-4 order-1 lg:order-2">
                                <BasketSummary />
                            </div>

                            {/* Product List Column */}
                            <div className="lg:col-span-8 order-2 lg:order-1 space-y-4">
                                <div className="space-y-4">
                                    {cartItems.map((item) => {
                                        const itemStockData = products.find(
                                            (prod) =>
                                                prod.id === item.product.id,
                                        );

                                        const isAvailable =
                                            itemStockData &&
                                            itemStockData.inStock &&
                                            itemStockData.quantity >=
                                                item.quantity;

                                        const availableStock =
                                            itemStockData?.quantity || 0;

                                        const itemClass = isAvailable
                                            ? `bg-white p-2 sm:p-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-4 transition-shadow hover:shadow-lg`
                                            : `bg-red-50 p-2 sm:p-2 rounded-xl shadow-md border-2 border-red-300 flex items-center gap-4 transition-shadow hover:shadow-lg opacity-85`;

                                        return (
                                            <div
                                                key={item.product?.id}
                                                className={itemClass}
                                            >
                                                <div className="flex-1 min-w-0 flex items-center gap-4">
                                                    <Link
                                                        to={`/products/${item.product?.id}`}
                                                        className="shrink-0"
                                                    >
                                                        <img
                                                            src={
                                                                item.product
                                                                    ?.images?.[0]
                                                            }
                                                            alt={
                                                                item.product
                                                                    ?.name
                                                            }
                                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-100"
                                                        />
                                                    </Link>

                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            to={`/products/${item.product?.id}`}
                                                        >
                                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate hover:text-green-600 transition-colors">
                                                                {
                                                                    item.product
                                                                        ?.name
                                                                }
                                                            </h3>
                                                        </Link>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            {
                                                                item.product
                                                                    ?.category
                                                            }{" "}
                                                            | Price per unit:
                                                            KES{" "}
                                                            {item.product?.price.toFixed(
                                                                0,
                                                            )}
                                                        </p>

                                                        {!isAvailable && (
                                                            <p className="text-xs sm:text-sm font-medium text-red-600 mt-1 p-1 bg-red-100 rounded-md inline-block">
                                                                Only{" "}
                                                                {availableStock}{" "}
                                                                {
                                                                    item
                                                                        ?.product
                                                                        ?.unit
                                                                }{" "}
                                                                available.
                                                                Please reduce
                                                                quantity.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shrink-0 h-10">
                                                    <button
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item.product
                                                                    ?.id,
                                                            )
                                                        }
                                                        className="px-3 h-full hover:bg-gray-100 text-gray-700 transition-colors border-r border-gray-300 disabled:opacity-50"
                                                        disabled={
                                                            item.quantity <=
                                                            MIN_QTY
                                                        }
                                                    >
                                                        -
                                                    </button>

                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        // min={MIN_QTY}
                                                        max={availableStock}
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            setQuantity(
                                                                item.product.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        // onBlur={(e) => {
                                                        //     if (
                                                        //         !e.target.value
                                                        //     ) {
                                                        //         setQuantity(
                                                        //             item.product
                                                        //                 .id,
                                                        //             MIN_QTY,
                                                        //         );
                                                        //     }
                                                        // }}
                                                        className="
                                                                    w-20
                                                                    text-center
                                                                    text-sm
                                                                    font-medium
                                                                    text-gray-900
                                                                    outline-none
                                                                    bg-white
                                                                    focus:ring-1
                                                                    focus:ring-green-500
                                                                "
                                                    />

                                                    <span className="text-xs text-gray-500 hidden sm:inline  pr-4">
                                                        {item?.product?.unit}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item.product
                                                                    ?.id,
                                                            )
                                                        }
                                                        className="px-3 h-full hover:bg-gray-100 text-gray-700 transition-colors border-l border-gray-300 disabled:opacity-50"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-right flex items-center gap-3 shrink-0">
                                                    <p className="font-bold text-lg text-green-700 min-w-[6rem] hidden sm:block">
                                                        KES{" "}
                                                        {(
                                                            item.product
                                                                ?.price *
                                                            item?.quantity
                                                        ).toFixed(0)}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-red-500 hover:bg-red-50/50 hover:text-red-600"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRemoveItem(
                                                                item.product
                                                                    ?.id,
                                                            );
                                                        }}
                                                        title="Remove item"
                                                    >
                                                        <span>
                                                            <Trash className="w-5 h-5" />
                                                        </span>
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-6">
                                    <Link to="/">
                                        <Button
                                            variant="outline"
                                            className="text-green-600 flex items-center hover:bg-green-50 border-green-200"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Continue Shopping
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
