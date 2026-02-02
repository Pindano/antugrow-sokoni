import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Minus,
    Plus,
    ShoppingCart,
    Phone,
    Mail,
    MapPin,
    Loader2,
    AlertCircle,
    Trash,
} from "lucide-react";
import { getProductById } from "../lib/supabase";
import { Navigation } from "./Navigation";
import { ShieldCheck } from "lucide-react";
import { Star, Truck } from "lucide-react";
import { useProductContext } from "../providers/ProductProvider";
export default function ProductPage() {
    const {
        cartItems,
        addProductToCart,
        removeProductFromCart,
        MIN_QTY,
        setQuantity,
    } = useProductContext();
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const quantity =
        cartItems?.find((item) => item?.product?.id === productId)?.quantity ||
        MIN_QTY;
    const [selectedImage, setSelectedImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderForm, setOrderForm] = useState({
        fullName: "",
        phone: "",
        notes: "",
    });
    useEffect(() => {
        if (!product) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProductById(productId);
            if (!data) {
                navigate("/404", { replace: true });
                return;
            }

            setProduct(data);
        } catch (err) {
            console.error("Error loading product:", err);
            setError("Failed to load product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    //     const handleFormChange = (field, value) => {
    //         setOrderForm((prev) => ({ ...prev, [field]: value }));
    //     };

    //     const handleSubmit = (e) => {
    //         e.preventDefault();

    //         const total = quantity * product.price;
    //         const message = `New ${product.name} Order:
    // Name: ${orderForm.fullName}
    // Phone: ${orderForm.phone}
    // Product: ${product.name}
    // Quantity: ${quantity} ${product.unit}
    // Unit Price: KSh ${product.price}
    // Total: KSh ${total.toLocaleString()}
    // Delivery Location: ${orderForm.notes}
    // Payment: Cash/M-Pesa on delivery`;

    //         const whatsappUrl = `https://wa.me/254113675687?text=${encodeURIComponent(
    //             message,
    //         )}`;
    //         window.open(whatsappUrl, "_blank");
    //     };

    //     const scrollToOrder = () => {
    //         document
    //             .getElementById("order-section")
    //             ?.scrollIntoView({ behavior: "smooth" });
    //     };

    const cartItem = cartItems?.find(
        (item) => item?.product?.id === product?.id,
    );

    const total = quantity * product.price;

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
                <Navigation />

                {/* Main Content Skeleton Structure */}
                <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column Skeleton (Image and Description) */}
                        <div className="lg:col-span-7 xl:col-span-8 animate-pulse">
                            {/* 1. Large Image Placeholder */}
                            <div className="h-96 w-full rounded-2xl bg-gray-300 mb-8 shadow-md"></div>

                            {/* 2. Farmer Info / Tabs Placeholder */}
                            <div className="space-y-4">
                                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                                <div className="h-4 w-full bg-gray-200 rounded"></div>
                                <div className="h-4 w-11/12 bg-gray-200 rounded"></div>
                                <div className="h-4 w-10/12 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        {/* Right Column Skeleton (Sticky Order Controls) */}
                        <div className="lg:col-span-5 xl:col-span-4 sticky top-6 animate-pulse">
                            <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 space-y-6">
                                {/* Product Header / Title */}
                                <div className="space-y-3">
                                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-4/5 bg-gray-300 rounded-lg"></div>
                                    <div className="h-5 w-2/3 bg-gray-200 rounded"></div>
                                </div>

                                {/* Price */}
                                <div className="h-10 w-1/2 bg-green-200 rounded-lg"></div>

                                {/* Separator */}
                                <div className="h-px bg-gray-200"></div>

                                {/* Quantity Selector / Calculations */}
                                <div className="space-y-4">
                                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                                    <div className="h-6 w-full bg-gray-200 rounded-lg pt-2 border-t"></div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid gap-3 pt-4">
                                    <div className="h-12 w-full bg-green-300 rounded-lg"></div>
                                    <div className="h-11 w-full bg-gray-100 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional: Keep the spinning loader as a subtle indicator at the bottom */}
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
                <Navigation />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-10 text-red-600 mx-auto mb-4" />
                        <p className="text-red-600 text-lg mb-4">
                            {error || "Product not found"}
                        </p>
                        <Button
                            onClick={() => navigate("/products")}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Back to Products
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-slate-800 font-sans">
            <Navigation showBackButton={true} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* RIGHT COLUMN: Sticky Sidebar (Spans 4 cols) */}
                    <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Product Header Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            {product.inStock ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none px-2 py-0.5 text-[10px] uppercase tracking-wide">
                                                    In Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Out of Stock
                                                </Badge>
                                            )}
                                            {product.badges?.map(
                                                (badge, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                        className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-100 px-2 py-0.5 text-[10px] uppercase tracking-wide"
                                                    >
                                                        {badge}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                                            {product.name}
                                        </h1>
                                        <div className="flex items-center gap-1 mt-2">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-4 h-4 fill-current"
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500 ml-1">
                                                (New Listing)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-2xl font-bold text-green-700">
                                        KSh {product.price.toLocaleString()}
                                    </span>
                                    <span className="text-gray-500 font-medium">
                                        / {product.unit}
                                    </span>
                                </div>

                                <Separator className="mb-6" />

                                {/* Interactive Order Controls */}
                                <div className="space-y-6">
                                    {cartItem && (
                                        <>
                                            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <Label className="text-sm font-medium text-gray-700">
                                                        Quantity needed
                                                    </Label>
                                                    <span className="text-xs text-green-600 font-medium">
                                                        {product.quantity}{" "}
                                                        {product.unit} available
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            setQuantity(
                                                                product.id,
                                                                quantity - 1,
                                                            )
                                                        }
                                                        disabled={
                                                            quantity <= MIN_QTY
                                                        }
                                                        className="h-10 w-10 bg-white shadow-sm border-gray-200"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>

                                                    <div className="flex-1 relative">
                                                        <Input
                                                            type="number"
                                                            value={quantity}
                                                            onChange={(e) =>
                                                                setQuantity(
                                                                    product.id,
                                                                    Number.parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            className="w-full text-center h-10 border-gray-200 focus-visible:ring-green-500"
                                                            max={
                                                                product.quantity
                                                            }
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                                                            {product.unit}s
                                                        </span>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            setQuantity(
                                                                product.id,
                                                                quantity + 1,
                                                            )
                                                        }
                                                        disabled={
                                                            quantity >=
                                                            product.quantity
                                                        }
                                                        className="h-10 w-10 bg-white shadow-sm border-gray-200"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Calculations */}
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between text-gray-500">
                                                    <span>Subtotal</span>
                                                    <span>
                                                        KSh{" "}
                                                        {total.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-gray-500">
                                                    <span>Platform Fee</span>
                                                    <span>
                                                        Calculated at checkout
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t">
                                                    <span>Est. Total</span>
                                                    <span>
                                                        KSh{" "}
                                                        {total.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* <button
                                                className="cursor-pointer h-10 w-10 flex items-center justify-center text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors shrink-0"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    // Action: Remove Item
                                                    removeProductFromCart(
                                                        product.id
                                                    );
                                                }}
                                                title="Remove item completely"
                                            ></button> */}

                                    {/* Action Buttons */}
                                    <div className="grid gap-3">
                                        {cartItem != null ? (
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    onClick={() => {
                                                        navigate("/cart");
                                                    }}
                                                    className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white h-10 text-base shadow-lg shadow-green-200"
                                                    disabled={!product.inStock}
                                                >
                                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                                    {product.inStock
                                                        ? "Proceed to Checkout"
                                                        : "Out of Stock"}
                                                </Button>
                                                <button
                                                    className="cursor-pointer h-10 w-10 flex items-center justify-center text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors shrink-0"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        // Action: Remove Item
                                                        removeProductFromCart(
                                                            product.id,
                                                        );
                                                    }}
                                                    title="Remove item completely"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    addProductToCart(product);
                                                }}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white h-10 text-base shadow-lg shadow-green-200"
                                                disabled={!product.inStock}
                                            >
                                                <ShoppingCart className="w-5 h-5 mr-2" />
                                                {product.inStock
                                                    ? "Add to Basket"
                                                    : "Out of Stock"}
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                window.open(
                                                    `https://wa.me/254113675687?text=Hi! I'm interested in ordering ${product.name}`,
                                                    "_blank",
                                                )
                                            }
                                            className="w-full h-10 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            Contact Farmer Directly
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Signals Card */}
                            <Card className="bg-stone-50/50 border-none shadow-none">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                            <Truck className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                Delivery Available
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Delivery arranged directly with
                                                farmer post-purchase.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                            <ShieldCheck className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                Verified Quality
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Produce verified by platform
                                                agents.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* LEFT COLUMN: Images & Detailed Info (Spans 8 cols) */}
                    <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8 space-y-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div
                                className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-sm border border-stone-100 group relative"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <img
                                    src={
                                        product.images?.[selectedImage] ||
                                        "/placeholder.svg"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                                    Click to expand
                                </div>
                            </div>

                            {product.images?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg border-2 transition-all ${
                                                selectedImage === index
                                                    ? "border-green-600 ring-2 ring-green-100 ring-offset-1"
                                                    : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-200"
                                            }`}
                                        >
                                            <img
                                                src={
                                                    image || "/placeholder.svg"
                                                }
                                                alt={`View ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* TABS - Moved inside left column for better flow */}
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                            <Tabs defaultValue="details" className="w-full">
                                <div className="border-b px-4 pt-2 bg-stone-50/50">
                                    <TabsList className="bg-transparent h-10 gap-6 p-0">
                                        <TabsTrigger
                                            value="details"
                                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-t-0 data-[state=active]:border-x-0  data-[state=active]:border-green-600 rounded-none px-0 text-slate-500 data-[state=active]:text-green-700 font-semibold"
                                        >
                                            Product Details
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="farming"
                                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-t-0 data-[state=active]:border-x-0 data-[state=active]:border-green-600 rounded-none px-0 text-slate-500 data-[state=active]:text-green-700 font-semibold"
                                        >
                                            Farm & Harvest
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="p-6 sm:p-8">
                                    <TabsContent
                                        value="details"
                                        className="mt-0 space-y-6 animate-in fade-in-50"
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                Description
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-dashed">
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                    Category
                                                </span>
                                                <p className="font-medium text-slate-700">
                                                    {product.category}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                    Harvest Unit
                                                </span>
                                                <p className="font-medium text-slate-700">
                                                    {product.unit}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                    Location
                                                </span>
                                                <p className="font-medium text-slate-700">
                                                    {product.location}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                    Availability
                                                </span>
                                                <p className="font-medium text-green-600">
                                                    {product.quantity} left
                                                </p>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent
                                        value="farming"
                                        className="mt-0 space-y-6 animate-in fade-in-50"
                                    >
                                        <div className="grid sm:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                                                    <MapPin className="w-4 h-4 text-green-600" />
                                                    Farm Details
                                                </h4>
                                                <dl className="space-y-3 text-sm">
                                                    <div className="flex justify-between py-2 border-b border-stone-100">
                                                        <dt className="text-gray-500">
                                                            Farmer
                                                        </dt>
                                                        <dd className="font-medium">
                                                            {
                                                                product.farmer_name
                                                            }
                                                        </dd>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-stone-100">
                                                        <dt className="text-gray-500">
                                                            Region
                                                        </dt>
                                                        <dd className="font-medium">
                                                            {
                                                                product.farm_location
                                                            }
                                                        </dd>
                                                    </div>
                                                    {product.farm_size && (
                                                        <div className="flex justify-between py-2 border-b border-stone-100">
                                                            <dt className="text-gray-500">
                                                                Scale
                                                            </dt>
                                                            <dd className="font-medium">
                                                                {
                                                                    product.farm_size
                                                                }{" "}
                                                                {
                                                                    product.farm_size_unit
                                                                }
                                                            </dd>
                                                        </div>
                                                    )}
                                                </dl>
                                            </div>

                                            <div>
                                                <h4 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                                                    <ShieldCheck className="w-4 h-4 text-green-600" />
                                                    Practices
                                                </h4>
                                                <div className="space-y-4">
                                                    {(product.irrigation_method ||
                                                        product.water_source) && (
                                                        <div className="bg-stone-50 p-3 rounded-lg text-sm">
                                                            <span className="block text-xs text-gray-500 mb-1">
                                                                Water Management
                                                            </span>
                                                            <div className="font-medium text-slate-700">
                                                                {
                                                                    product.irrigation_method
                                                                }{" "}
                                                                using{" "}
                                                                {
                                                                    product.water_source
                                                                }
                                                            </div>
                                                        </div>
                                                    )}

                                                    {product.fertilizers
                                                        ?.length > 0 && (
                                                        <div>
                                                            <span className="text-xs text-gray-500 mb-2 block">
                                                                Fertilizers Used
                                                            </span>
                                                            <div className="flex flex-wrap gap-2">
                                                                {product.fertilizers.map(
                                                                    (
                                                                        item,
                                                                        idx,
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                idx
                                                                            }
                                                                            variant="outline"
                                                                            className="bg-white border-stone-200 text-stone-600 font-normal"
                                                                        >
                                                                            {
                                                                                item
                                                                            }
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh]">
                        <img
                            src={
                                product.images?.[selectedImage] ||
                                "/placeholder.svg"
                            }
                            alt={product.name}
                            className="w-full h-full object-contain rounded-lg shadow-2xl"
                        />
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm uppercase tracking-widest flex items-center gap-2"
                        >
                            Close{" "}
                            <span className="text-2xl leading-none">×</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
