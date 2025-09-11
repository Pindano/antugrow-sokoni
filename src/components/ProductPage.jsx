"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, ShoppingCart, Phone, Mail, MapPin, Leaf, Calendar, Shield, Star, Package } from "lucide-react"
import { getProductById } from "../data/products"
import { Navigation } from "./Navigation"

export default function ProductPage() {
    const { productId } = useParams()
    const navigate = useNavigate()
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isBulkOrder, setIsBulkOrder] = useState(false)
    const [orderForm, setOrderForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        paymentMethod: "mpesa", // Default to M-Pesa only
        notes: "",
    })
    const product = getProductById(productId)

    // If product doesn't exist, redirect to 404
    if (!product) {
        navigate("/404", { replace: true })
        return null
    }

    const currentPrice = isBulkOrder && product.bulkPricing.enabled ? product.bulkPricing.pricePerKg : product.price
    const subtotal = quantity * currentPrice
    const total = subtotal // No delivery fees

    const handleQuantityChange = (newQuantity) => {
        const minQuantity = isBulkOrder && product.bulkPricing.enabled ? product.bulkPricing.minimumQuantity : 1
        if (newQuantity >= minQuantity) {
            setQuantity(newQuantity)
        }
    }

    const handleBulkToggle = (bulk) => {
        setIsBulkOrder(bulk)
        if (bulk && product.bulkPricing.enabled) {
            setQuantity(product.bulkPricing.minimumQuantity)
        } else {
            setQuantity(1)
        }
    }

    const handleFormChange = (field, value) => {
        setOrderForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const orderType = isBulkOrder ? "Bulk" : "Regular"
        const message = `New ${product.name} Order:
Name: ${orderForm.fullName}
Phone: ${orderForm.phone}
Email: ${orderForm.email}
Address: ${orderForm.address}
Product: ${product.name}
Order Type: ${orderType}
Quantity: ${quantity} ${product.unit}
Unit Price: KSh ${currentPrice}
Payment: M-Pesa
Total: KSh ${total}
Notes: ${orderForm.notes}`

        const whatsappUrl = `https://wa.me/254113675687?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, "_blank")
    }

    const scrollToOrder = () => {
        document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })
    }

    const getStockStatusDisplay = () => {
        switch (product.stockStatus) {
            case "available":
                return { text: "In Stock", color: "bg-green-100 text-green-800", available: true }
            case "out_of_stock":
                return { text: "Out of Stock", color: "bg-red-100 text-red-800", available: false }
            case "preorder":
                return { text: "Pre-order Available", color: "bg-blue-100 text-blue-800", available: true }
            default:
                return { text: "Unknown", color: "bg-gray-100 text-gray-800", available: false }
        }
    }

    const stockStatus = getStockStatusDisplay()

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
            <Navigation showBackButton={true} currentProduct={product} />

            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-4">{product.description}</p>
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {product.badges.map((badge, index) => (
                                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                    {badge}
                                </Badge>
                            ))}
                            <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Product Section */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
                            <img
                                src={product.images[selectedImage] || "/placeholder.svg?height=500&width=500&query=fresh produce"}
                                alt={product.name}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-3 gap-3">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                            selectedImage === index
                                                ? "border-green-500 ring-2 ring-green-200"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <img
                                            src={image || "/placeholder.svg?height=150&width=150&query=fresh produce"}
                                            alt={`View ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-6">
                                KSh {currentPrice}{" "}
                                <span className="text-base sm:text-lg font-normal text-gray-500">per {product.unit}</span>
                                {isBulkOrder && product.bulkPricing.enabled && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        Regular price: KSh {product.price} per {product.unit}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="farming">Farming Details</TabsTrigger>
                                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-4">
                                <Card>
                                    <CardContent className="p-4 sm:p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">Product Features</h3>
                                        <ul className="space-y-2">
                                            {product.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                                                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                                    </div>
                                                    <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-green-600" />
                                                <div>
                                                    <div className="text-xs text-gray-500">Harvest Date</div>
                                                    <div className="text-sm font-medium">
                                                        {new Date(product.harvestDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-green-600" />
                                                <div>
                                                    <div className="text-xs text-gray-500">Shelf Life</div>
                                                    <div className="text-sm font-medium">{product.shelfLife}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="farming" className="space-y-4">
                                <Card>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Leaf className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Organic Status</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {product.isOrganic ? "Organic" : "Conventionally Grown"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Pesticide Information</h4>
                                                    <p className="text-sm text-gray-600">{product.pesticidesUsed}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Star className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Crop History</h4>
                                                    <p className="text-sm text-gray-600">{product.cropHistory}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Taste Profile</h4>
                                                    <p className="text-sm text-gray-600">{product.tasteProfile}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="nutrition" className="space-y-4">
                                <Card>
                                    <CardContent className="p-4 sm:p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">Nutritional Highlights</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {product.nutritionalHighlights.map((highlight, index) => (
                                                <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                                    <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></div>
                                                    <span className="text-sm font-medium text-gray-700">{highlight}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Card>
                            <CardContent className="p-4 sm:p-6">
                                <div className="space-y-6">
                                    {/* Order Type Selection */}
                                    {product.bulkPricing.enabled && (
                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold">Order Type</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <Button
                                                    variant={!isBulkOrder ? "default" : "outline"}
                                                    onClick={() => handleBulkToggle(false)}
                                                    className="justify-start h-auto p-4"
                                                >
                                                    <div className="text-left">
                                                        <div className="font-semibold">Regular Order</div>
                                                        <div className="text-sm opacity-75">
                                                            1-49 {product.unit} • KSh {product.price}/{product.unit}
                                                        </div>
                                                    </div>
                                                </Button>
                                                <Button
                                                    variant={isBulkOrder ? "default" : "outline"}
                                                    onClick={() => handleBulkToggle(true)}
                                                    className="justify-start h-auto p-4"
                                                >
                                                    <div className="text-left">
                                                        <div className="font-semibold">Bulk</div>
                                                        <div className="text-sm opacity-75">
                                                            Min {product.bulkPricing.minimumQuantity} {product.unit} • KSh{" "}
                                                            {product.bulkPricing.pricePerKg}/{product.unit}
                                                        </div>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold">
                                            Quantity ({product.unit})
                                            {isBulkOrder && product.bulkPricing.enabled && (
                                                <span className="text-sm font-normal text-gray-500 ml-2">
                          (Minimum: {product.bulkPricing.minimumQuantity} {product.unit})
                        </span>
                                            )}
                                        </Label>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleQuantityChange(quantity - 1)}
                                                disabled={
                                                    quantity <=
                                                    (isBulkOrder && product.bulkPricing.enabled ? product.bulkPricing.minimumQuantity : 1)
                                                }
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <Input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                                                className="w-20 text-center"
                                                min={isBulkOrder && product.bulkPricing.enabled ? product.bulkPricing.minimumQuantity : 1}
                                            />
                                            <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity + 1)}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Unit Price:</span>
                                        <span className="font-semibold">
                      KSh {currentPrice} per {product.unit}
                    </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Quantity:</span>
                                        <span className="font-semibold">
                      {quantity} {product.unit}
                    </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold text-green-600">
                                        <span>Total:</span>
                                        <span>KSh {total.toLocaleString()}</span>
                                    </div>
                                    {isBulkOrder && product.bulkPricing.enabled && (
                                        <div className="text-sm text-green-600 text-right">
                                            You save KSh {((product.price - product.bulkPricing.pricePerKg) * quantity).toLocaleString()} with
                                            bulk pricing!
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                    <Button
                                        onClick={scrollToOrder}
                                        className="flex-1 bg-green-600 hover:bg-green-700 py-3"
                                        disabled={!stockStatus.available}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        {stockStatus.available
                                            ? product.stockStatus === "preorder"
                                                ? "Pre-order Now"
                                                : "Order Now"
                                            : "Out of Stock"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            window.open(
                                                `https://wa.me/254113675687?text=Hi! I'm interested in ordering ${product.name}`,
                                                "_blank",
                                            )
                                        }
                                        className="sm:w-auto"
                                    >
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Contact & Order Section */}
                <div id="order-section" className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="font-semibold">Phone/WhatsApp</div>
                                    <div className="text-gray-600">+254 113 675687</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-semibold">Email</div>
                                    <div className="text-gray-600">info@antugrow.com</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <div className="font-semibold">Location</div>
                                    <div className="text-gray-600">Nairobi, Kenya</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Place Your Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input
                                        id="fullName"
                                        value={orderForm.fullName}
                                        onChange={(e) => handleFormChange("fullName", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+254 700 000 000"
                                        value={orderForm.phone}
                                        onChange={(e) => handleFormChange("phone", e.target.value)}
                                        required
                                    />
                                </div>

                                {/*<div className="space-y-2">*/}
                                {/*    <Label htmlFor="email">Email Address</Label>*/}
                                {/*    <Input*/}
                                {/*        id="email"*/}
                                {/*        type="email"*/}
                                {/*        placeholder="your@email.com"*/}
                                {/*        value={orderForm.email}*/}
                                {/*        onChange={(e) => handleFormChange("email", e.target.value)}*/}
                                {/*    />*/}
                                {/*</div>*/}

                                {/*<div className="space-y-2">*/}
                                {/*    <Label htmlFor="address">Delivery Address *</Label>*/}
                                {/*    <Textarea*/}
                                {/*        id="address"*/}
                                {/*        placeholder="Enter your full delivery address"*/}
                                {/*        value={orderForm.address}*/}
                                {/*        onChange={(e) => handleFormChange("address", e.target.value)}*/}
                                {/*        required*/}
                                {/*    />*/}
                                {/*</div>*/}



                                <div className="space-y-2">
                                    <Label htmlFor="notes">Delivery Location *</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Where is your delivery point..."
                                        value={orderForm.notes}
                                        onChange={(e) => handleFormChange("notes", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            </div>
                                            <span className="font-semibold text-green-800">Payment</span>
                                        </div>
                                        <p className="text-sm text-green-700 mt-1">
                                            Pay on delivery using M-Pesa or cash.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                                    disabled={!stockStatus.available}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    {stockStatus.available
                                        ? `${product.stockStatus === "preorder" ? "Confirm Pre-order" : "Confirm Order"} - KSh ${total.toLocaleString()}`
                                        : "Product Out of Stock"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Image Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={product.images[selectedImage] || "/placeholder.svg?height=800&width=800&query=fresh produce"}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
