import React, { useState, useEffect } from "react";
import {
    X,
    User,
    ChevronLeft,
    ChevronRight,
    Phone,
    MapPin,
    Truck,
    Loader2,
    Banknote,
    CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

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

export const CheckoutModal = ({ isOpen, onClose, cartTotal, cartItems }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: Payment & Confirm
    const [calculatingFee, setCalculatingFee] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(null);
    const [distance, setDistance] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        notes: "",
        paymentMethod: "delivery",
    });

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setDeliveryFee(null);
            setDistance(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- LOGIC HANDLERS ---

    const handleAddressCheck = () => {
        if (!formData.address) return;
        setCalculatingFee(true);

        // SIMULATION: Google Maps Distance Matrix
        setTimeout(() => {
            const mockDistance = Math.floor(Math.random() * 13) + 2;
            const calculatedFee = 50 + mockDistance * 20;
            setDistance(mockDistance);
            setDeliveryFee(calculatedFee);
            setCalculatingFee(false);
        }, 1500);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Reset fee if address changes, forcing re-calculation
        if (name === "address") setDeliveryFee(null);
    };

    const handleNextStep = () => {
        if (
            step === 1 &&
            formData.name &&
            formData.phone &&
            deliveryFee !== null
        ) {
            setStep(2);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            setPlacingOrder(true);
            // clear cart (local storage)
            localStorage.removeItem("cartItems");

            setTimeout(() => {
                console.log("Order Placed:", {
                    ...formData,
                    items: cartItems,
                    deliveryFee,
                    total: cartTotal + (deliveryFee || 0),
                });
                setPlacingOrder(false);
                toast.success("Order placed successfully!");
                window.location.href = "/orders";
            }, 1500);
        } catch (error) {
            toast.error("Failed to place order. Please try again.");
            console.error("Order Error:", error);
        } finally {
            // setPlacingOrder(false);
        }
    };

    const finalTotal = cartTotal + (deliveryFee || 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header with Steps */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-4">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {step === 1
                                    ? "Delivery Details"
                                    : "Payment & Confirm"}
                            </h2>
                            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
                                Step {step} of 2
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                    {/* --- STEP 1: WHO & WHERE --- */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* Personal Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="0712 345 678"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-green-700 font-semibold">
                                    <MapPin className="w-5 h-5" />
                                    <h3>Delivery Location</h3>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 123 Ngong Road, Nairobi"
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                    <Button
                                        onClick={handleAddressCheck}
                                        disabled={
                                            !formData.address || calculatingFee
                                        }
                                        loading={calculatingFee}
                                        variant="outline"
                                        className="shrink-0"
                                    >
                                        {deliveryFee ? "Update" : "Check Fee"}
                                    </Button>
                                </div>

                                {/* Fee Result */}
                                {deliveryFee !== null && (
                                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex justify-between items-center animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-200 p-2 rounded-lg">
                                                <Truck className="w-5 h-5 text-green-700" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-green-900">
                                                    Delivery Available
                                                </p>
                                                <p className="text-xs text-green-700">
                                                    ~{distance}km from farm
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-green-800 text-lg">
                                            KES {deliveryFee.toFixed(0)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- STEP 2: PAYMENT & REVIEW --- */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* Order Summary Card */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                                    Order Summary
                                </h3>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>
                                        Produce Subtotal (
                                        {cartItems?.length || 0} items)
                                    </span>
                                    <span>KES {cartTotal.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mb-3 pb-3 border-b border-gray-200">
                                    <span>Delivery Fee</span>
                                    <span>KES {deliveryFee?.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="font-extrabold text-green-700 text-xl">
                                        KES {finalTotal.toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Banknote className="w-5 h-5 text-green-600" />{" "}
                                    Payment Method
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {["delivery", "prepay"].map((method) => (
                                        <label
                                            key={method}
                                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                                formData.paymentMethod ===
                                                method
                                                    ? "border-green-600 bg-green-50/50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method}
                                                checked={
                                                    formData.paymentMethod ===
                                                    method
                                                }
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-green-600 focus:ring-green-500"
                                            />
                                            <div className="flex-1">
                                                <span className="block font-semibold text-gray-900">
                                                    {method === "delivery"
                                                        ? "Pay on Delivery"
                                                        : "Pay Now"}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {method === "delivery"
                                                        ? "Cash/M-Pesa on arrival"
                                                        : "Secure Card/M-Pesa prompt"}
                                                </span>
                                            </div>
                                            {method === "delivery" ? (
                                                <Truck className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <CreditCard className="w-5 h-5 text-gray-400" />
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Delivery Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none h-20 resize-none"
                                    placeholder="Gate code, specific instructions..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 bg-white sticky bottom-0 z-10 rounded-b-2xl">
                    {step === 1 ? (
                        <Button
                            size="lg"
                            onClick={handleNextStep}
                            disabled={
                                !formData.name ||
                                !formData.phone ||
                                deliveryFee === null
                            }
                            className="w-full py-3 text-lg flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                        >
                            Next Step <ChevronRight className="w-5 h-5" />
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder}
                            className="w-full py-3 text-lg font-bold shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {placingOrder ? (
                                <span className="flex items-center">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Placing Order
                                </span>
                            ) : (
                                `Confirm Order (KES ${finalTotal.toFixed(0)})`
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
