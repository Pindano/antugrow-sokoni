import React from "react";

export default function CartSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-10 w-2/5 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-5 w-1/4 bg-gray-100 rounded mb-10"></div>

            {/* Cart Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column Skeleton (Product List - lg:col-span-8) */}
                <div className="lg:col-span-8 order-2 lg:order-1 space-y-4">
                    {/* Skeleton for 3 Cart Items */}
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white p-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-4"
                        >
                            {/* Image Placeholder */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg shrink-0"></div>

                            {/* Details Placeholder */}
                            <div className="flex-1 space-y-2">
                                <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            </div>

                            {/* Quantity Controls Placeholder */}
                            <div className="w-28 h-10 bg-gray-200 rounded-lg shrink-0"></div>

                            {/* Price & Remove Placeholder */}
                            <div className="text-right flex items-center gap-3 shrink-0">
                                <div className="h-7 w-20 bg-green-100 rounded-lg hidden sm:block"></div>
                                <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    ))}

                    {/* Continue Shopping CTA Placeholder */}
                    <div className="pt-6">
                        <div className="h-10 w-40 bg-gray-100 rounded-lg"></div>
                    </div>
                </div>

                {/* Right Column Skeleton (Summary - lg:col-span-4) */}
                <div className="lg:col-span-4 order-1 lg:order-2">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="h-6 w-3/5 bg-gray-300 rounded mb-5 border-b pb-3"></div>

                        {/* Summary Lines */}
                        <div className="space-y-4 pb-4 mb-4">
                            <div className="flex justify-between">
                                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                                <div className="h-4 w-1/5 bg-gray-200 rounded"></div>
                            </div>
                            <div className="flex justify-between">
                                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-1/6 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
                            <div className="h-8 w-1/4 bg-green-200 rounded-lg"></div>
                        </div>

                        {/* Checkout Button Placeholder */}
                        <div className="w-full h-12 bg-green-300 rounded-xl mt-6"></div>

                        {/* Security Text Placeholder */}
                        <div className="h-3 w-1/2 bg-gray-100 mx-auto mt-4 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
