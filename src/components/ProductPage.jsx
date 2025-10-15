import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, ShoppingCart, Phone, Mail, MapPin, Loader2, AlertCircle } from "lucide-react"
import { getProductById } from "../lib/supabase"
import { Navigation } from "./Navigation"

export default function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderForm, setOrderForm] = useState({
    fullName: "",
    phone: "",
    notes: "",
  })

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProductById(productId)
      if (!data) {
        navigate("/404", { replace: true })
        return
      }
      setProduct(data)
    } catch (err) {
      console.error('Error loading product:', err)
      setError('Failed to load product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleFormChange = (field, value) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const total = quantity * product.price
    const message = `New ${product.name} Order:
Name: ${orderForm.fullName}
Phone: ${orderForm.phone}
Product: ${product.name}
Quantity: ${quantity} ${product.unit}
Unit Price: KSh ${product.price}
Total: KSh ${total.toLocaleString()}
Delivery Location: ${orderForm.notes}
Payment: Cash/M-Pesa on delivery`

    const whatsappUrl = `https://wa.me/254113675687?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
            <Button onClick={() => navigate('/products')} className="bg-green-600 hover:bg-green-700">
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const total = quantity * product.price

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Navigation showBackButton={true} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4">{product.short_description}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {product.badges?.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                  {badge}
                </Badge>
              ))}
              <Badge className={product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
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
                src={product.images?.[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${selectedImage === index
                        ? "border-green-500 ring-2 ring-green-200"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
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
                KSh {product.price.toLocaleString()}{" "}
                <span className="text-base sm:text-lg font-normal text-gray-500">per {product.unit}</span>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="farming">Farm Info</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Product Description</h3>
                    <p className="text-gray-700 mb-4">{product.description}</p>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
                      <div>
                        <div className="text-xs text-gray-500">Category</div>
                        <div className="text-sm font-medium">{product.category}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Available</div>
                        <div className="text-sm font-medium">{product.quantity} {product.unit}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="text-sm font-medium">{product.location}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Unit</div>
                        <div className="text-sm font-medium">{product.unit}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="farming" className="space-y-4">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Farmer Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Name:</span>
                            <span className="text-sm font-medium">{product.farmer_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Farm Location:</span>
                            <span className="text-sm font-medium">{product.farm_location}</span>
                          </div>
                          {product.farm_size && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Farm Size:</span>
                              <span className="text-sm font-medium">
                                {product.farm_size} {product.farm_size_unit}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {(product.irrigation_method || product.water_source) && (
                        <div className="pt-4 border-t">
                          <h4 className="font-semibold text-gray-900 mb-2">Farming Practices</h4>
                          <div className="space-y-2">
                            {product.irrigation_method && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Irrigation:</span>
                                <span className="text-sm font-medium">{product.irrigation_method}</span>
                              </div>
                            )}
                            {product.water_source && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Water Source:</span>
                                <span className="text-sm font-medium">{product.water_source}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {(product.pesticides?.length > 0 || product.fertilizers?.length > 0) && (
                        <div className="pt-4 border-t">
                          <h4 className="font-semibold text-gray-900 mb-2">Crop Management</h4>
                          {product.fertilizers?.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm text-gray-600">Fertilizers:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.fertilizers.map((item, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.pesticides?.length > 0 && (
                            <div>
                              <span className="text-sm text-gray-600">Pesticides:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.pesticides.map((item, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      Quantity ({product.unit})
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Available: {product.quantity} {product.unit})
                      </span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                        className="w-20 text-center"
                        min={1}
                        max={product.quantity}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.quantity}
                      >
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
                      KSh {product.price.toLocaleString()} per {product.unit}
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
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    onClick={scrollToOrder}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-3"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? "Order Now" : "Out of Stock"}
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

                <div className="space-y-2">
                  <Label htmlFor="notes">Delivery Location *</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter your delivery address..."
                    value={orderForm.notes}
                    onChange={(e) => handleFormChange("notes", e.target.value)}
                    required
                    rows={3}
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
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock
                    ? `Confirm Order - KSh ${total.toLocaleString()}`
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
              src={product.images?.[selectedImage] || "/placeholder.svg"}
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
