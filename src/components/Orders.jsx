import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "./Navigation"; // Assuming this exists based on your snippet
import {
    Package,
    ChevronDown,
    ChevronUp,
    Search,
    CreditCard,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    Phone,
} from "lucide-react";

// --- Reusing your Button Component for consistency ---
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
    } else if (variant === "danger-outline") {
        style = `${baseStyle} bg-white border border-red-200 text-red-600 hover:bg-red-50`;
    } else {
        style = `${baseStyle} bg-green-600 text-white hover:bg-green-700 shadow-md`;
    }

    if (size === "sm") {
        style = `${style} text-sm px-3 py-1.5`;
    } else if (size === "lg") {
        style = `${style} text-lg px-6 py-3`;
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
            {children}
        </button>
    );
};

// --- Mock Data ---
const MOCK_ORDERS = [
    {
        id: "ORD-7782-XJ",
        date: "2025-10-24",
        status: "In Progress",
        paymentStatus: "Unpaid",
        total: 4500,
        items: [
            {
                id: 1,
                name: "Organic Kale",
                price: 200,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&q=80&w=100",
            },
            {
                id: 2,
                name: "Red Tomatoes",
                price: 150,
                quantity: 5,
                image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=100",
            },
        ],
    },
    {
        id: "ORD-9921-MC",
        date: "2025-10-20",
        status: "Delivered",
        paymentStatus: "Paid",
        total: 1200,
        items: [
            {
                id: 3,
                name: "Fresh Carrots",
                price: 100,
                quantity: 12,
                image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=100",
            },
        ],
    },
    {
        id: "ORD-3321-KL",
        date: "2025-10-15",
        status: "Cancelled",
        paymentStatus: "Refunded",
        total: 3400,
        items: [
            {
                id: 4,
                name: "Potatoes (10kg)",
                price: 800,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=100",
            },
            {
                id: 5,
                name: "Onions",
                price: 120,
                quantity: 5,
                image: "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=100",
            },
        ],
    },
];

export default function OrdersPage() {
    const [filter, setFilter] = useState("All");
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Filter Logic
    const filteredOrders = MOCK_ORDERS.filter((order) => {
        if (filter === "All") return true;
        return order.status === filter;
    });

    // Toggle Order Details
    const toggleOrder = (id) => {
        if (expandedOrder === id) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(id);
        }
    };

    // Handler for Cancellation
    const handleCancelRequest = (e) => {
        e.stopPropagation(); // Prevent accordion from toggling
        alert(
            "To cancel this order, please contact our support team at +254 700 000 000 or support@harvest.com"
        );
    };

    // Handler for Payment
    const handlePayNow = (e, orderId) => {
        e.stopPropagation();
        // Logic to open payment modal or redirect to gateway would go here
        alert(`Redirecting to payment gateway for order ${orderId}...`);
    };

    // Helper: Status Badge Color
    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700 border-green-200";
            case "In Progress":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Cancelled":
                return "bg-red-50 text-red-600 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // Helper: Status Icon
    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return <CheckCircle className="w-4 h-4 mr-1" />;
            case "In Progress":
                return <Clock className="w-4 h-4 mr-1" />;
            case "Cancelled":
                return <XCircle className="w-4 h-4 mr-1" />;
            default:
                return <AlertCircle className="w-4 h-4 mr-1" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Your Orders
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Track, pay for, or review your past purchases.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
                    {["All", "In Progress", "Delivered", "Cancelled"].map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                    filter === status
                                        ? "bg-green-600 text-white shadow-md"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                {status}
                            </button>
                        )
                    )}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">
                                No orders found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                You don't have any orders in this category.
                            </p>
                            <Link to="/">
                                <Button variant="outline">
                                    Start Shopping
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                                    expandedOrder === order.id
                                        ? "shadow-md border-green-200 ring-1 ring-green-100"
                                        : "shadow-sm border-gray-200 hover:shadow-md"
                                }`}
                            >
                                {/* Order Summary Card (Clickable) */}
                                <div
                                    onClick={() => toggleOrder(order.id)}
                                    className="p-5 cursor-pointer grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                                >
                                    {/* ID and Date */}
                                    <div className="sm:col-span-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {order.id}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Placed on {order.date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Statuses */}
                                    <div className="sm:col-span-4 flex flex-wrap gap-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                order.paymentStatus === "Paid"
                                                    ? "bg-gray-100 text-gray-700 border-gray-200"
                                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            }`}
                                        >
                                            {order.paymentStatus}
                                        </span>
                                    </div>

                                    {/* Total and Chevron */}
                                    <div className="sm:col-span-4 flex justify-between items-center sm:justify-end gap-4">
                                        <p className="font-bold text-gray-900">
                                            KES {order.total.toLocaleString()}
                                        </p>
                                        {expandedOrder === order.id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedOrder === order.id && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                            Items in Order
                                        </h4>
                                        <div className="space-y-3 mb-6">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-12 h-12 rounded-md object-cover bg-gray-200"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Qty:{" "}
                                                                {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        KES{" "}
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 border-t border-gray-200">
                                            {/* Cancel Logic */}
                                            {order.status !== "Cancelled" &&
                                                order.status !==
                                                    "Delivered" && (
                                                    <Button
                                                        variant="danger-outline"
                                                        size="sm"
                                                        onClick={
                                                            handleCancelRequest
                                                        }
                                                    >
                                                        <Phone className="w-4 h-4 mr-2" />
                                                        Cancel Order
                                                    </Button>
                                                )}

                                            {/* Pay Logic */}
                                            {order.paymentStatus === "Unpaid" &&
                                                order.status !==
                                                    "Cancelled" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) =>
                                                            handlePayNow(
                                                                e,
                                                                order.id
                                                            )
                                                        }
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <CreditCard className="w-4 h-4 mr-2" />
                                                        Pay Now
                                                    </Button>
                                                )}

                                            {/* Generic Help if needed */}
                                            {order.status === "Delivered" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Buy Again
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
