// src/pages/ProductReview.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";


export default function ProductReview() {
    const { token } = useParams(); // review token (approve token from email)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [tokens, setTokens] = useState(null);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        fetchProductData();
    }, [token]);

    const fetchProductData = async () => {
        try {
            // Validate token + fetch product and all tokens in one query
            const { data: tokenData, error: tokenError } = await supabase
                .from("approval_tokens")
                .select(
                    `
          token,
          action,
          expires_at,
          used_at,
          product_listings (
            *,
            approval_tokens (token, action, expires_at, used_at)
          )
        `
                )
                .eq("token", token)
                .gt("expires_at", new Date().toISOString())
                .is("used_at", null)
                .single();

            if (tokenError || !tokenData) {
                throw new Error("Invalid, expired, or already used review token");
            }

            const product = tokenData.product_listings;

            if (product.status !== "pending") {
                throw new Error(`Product has already been ${product.status}`);
            }

            // Extract approve + reject tokens from related approval_tokens
            const approveToken = product.approval_tokens.find(
                (t) => t.action === "approve" && !t.used_at
            )?.token;
            const rejectToken = product.approval_tokens.find(
                (t) => t.action === "reject" && !t.used_at
            )?.token;

            setProduct(product);
            setTokens({ approve: approveToken, reject: rejectToken });
            setLoading(false);
        } catch (err) {
            console.error("Error fetching product:", err);
            setError(err.message || "Failed to load product data");
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!tokens?.approve) {
            setError("Approval token not found");
            return;
        }

        setActionLoading(true);
        try {
            const { data, error } = await supabase.rpc("approve_product", {
                token_uuid: tokens.approve,
                admin_identifier: "web_interface",
            });

            if (error) throw new Error(error.message);
            if (!data.success) throw new Error(data.error || "Approval failed");

            alert(`Product "${product.name}" has been approved successfully!`);
        } catch (err) {
            console.error("Approval error:", err);
            setError(`Approval failed: ${err.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!tokens?.reject) {
            setError("Rejection token not found");
            return;
        }

        setActionLoading(true);
        try {
            const { data, error } = await supabase.rpc("reject_product", {
                token_uuid: tokens.reject,
                rejection_reason_text: rejectReason || "No reason provided",
                admin_identifier: "web_interface",
            });

            if (error) throw new Error(error.message);
            if (!data.success) throw new Error(data.error || "Rejection failed");

            alert(`Product "${product.name}" has been rejected.`);
        } catch (err) {
            console.error("Rejection error:", err);
            setError(`Rejection failed: ${err.message}`);
        } finally {
            setActionLoading(false);
            setShowRejectForm(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span>Loading product details...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Access Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar with Approve / Reject buttons */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Product Review</h1>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleApprove}
                                disabled={actionLoading}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
                            >
                                {actionLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>✅</span>
                                        <span>Approve Product</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowRejectForm(true)}
                                disabled={actionLoading}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
                            >
                                <span>❌</span>
                                <span>Reject Product</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Product Images</h2>
                        {product.images && product.images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No images uploaded</p>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Product Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <p className="text-lg font-semibold">{product.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <p className="capitalize">{product.category}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price</label>
                                    <p className="font-semibold">KSh {product.price} per {product.unit}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantity Available</label>
                                    <p>{product.quantity} {product.unit}s</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <p>{product.location}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                                <p>{product.short_description}</p>
                            </div>

                            {product.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Description</label>
                                    <p className="text-gray-600">{product.description}</p>
                                </div>
                            )}

                            {product.badges && product.badges.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {product.badges.map((badge, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Farmer Information */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Farmer Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Farmer Name</label>
                                <p className="font-semibold">{product.farmer_name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Farm Location</label>
                                <p>{product.farm_location}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Farm Size</label>
                                    <p>{product.farm_size} {product.farm_size_unit}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Irrigation Method</label>
                                    <p className="capitalize">{product.irrigation_method?.replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Water Source</label>
                                <p className="capitalize">{product.water_source?.replace('_', ' ')}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                                    <p>{product.contact_phone}</p>
                                </div>
                                {product.contact_email && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                        <p>{product.contact_email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Farming Practices */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Farming Practices</h2>
                        <div className="space-y-4">
                            {product.fertilizers && product.fertilizers.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fertilizers Used</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {product.fertilizers.map((fertilizer, index) => (
                                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                                {fertilizer}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.pesticides && product.pesticides.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pesticides Used</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {product.pesticides.map((pesticide, index) => (
                                            <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                                {pesticide}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.insecticides && product.insecticides.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Insecticides Used</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {product.insecticides.map((insecticide, index) => (
                                            <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                                                {insecticide}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.pests && product.pests.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pests & Diseases</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {product.pests.map((pest, index) => (
                                            <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                                                {pest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submission Info */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Submission Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Submitted</label>
                            <p>{new Date(product.created_at).toLocaleDateString()} at {new Date(product.created_at).toLocaleTimeString()}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product ID</label>
                            <p className="font-mono text-sm">{product.id}</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Reject Modal */}
            {showRejectForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Reject Product</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to reject "{product.name}"? This action
                            cannot be undone.
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for rejection (optional)
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter reason for rejection..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                rows="3"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRejectForm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg"
                            >
                                {actionLoading ? "Rejecting..." : "Confirm Rejection"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
