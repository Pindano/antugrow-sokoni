import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Phone, Mail, MapPin } from "lucide-react"
import { getAllProducts } from "../data/products"
import { Navigation } from "./Navigation"
import { Link } from "react-router-dom"

export default function ProductsListingPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const products = getAllProducts()

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
            <Navigation />

            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">Karibu Sokoni</h1>
                        <p className="text-xl text-gray-600 mb-6">Buy readily available fresh farm products</p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 py-3 text-lg"
                            />
                        </div>


                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Products Grid */}
                <div className="mb-8">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No products found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <Link key={product.id} to={`/products/${product.id}`}>
                                    <Card className="group cursor-pointer hover:shadow-xl py-0 transition-all duration-300 hover:-translate-y-1 bg-white h-full flex flex-col">
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                                            <img
                                                src={product.images[0] || "/placeholder.svg"}
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {!product.inStock && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                                                        Out of Stock
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-1 p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                                                    {product.name}
                                                </CardTitle>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{product.shortDescription}</p>

                                            <div className="space-y-3">
                                                <div className="text-xl font-bold text-green-600">
                                                    KSh {product.price}
                                                    <span className="text-sm font-normal text-gray-500 ml-1">per {product.unit}</span>
                                                </div>

                                                <div className="flex flex-wrap gap-1">
                                                    {product.badges.slice(0, 2).map((badge, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {badge}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <Button
                                                    className="w-full bg-green-600 hover:bg-green-700 group-hover:bg-green-700 transition-colors"
                                                    disabled={!product.inStock}
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    {product.inStock ? "View Details" : "Out of Stock"}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-16">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help with Your Order?</h3>
                        <p className="text-gray-600">Contact us directly for bulk orders or special requests</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Phone/WhatsApp</h4>
                            <p className="text-gray-600">+254 113 675687</p>
                            <Button
                                variant="outline"
                                className="mt-3 bg-transparent"
                                onClick={() =>
                                    window.open("https://wa.me/254113675687?text=Hi! I'm interested in ordering fruits", "_blank")
                                }
                            >
                                Contact Us
                            </Button>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                            <p className="text-gray-600">info@antugrow.com</p>
                            <Button
                                variant="outline"
                                className="mt-3 bg-transparent"
                                onClick={() => window.open("mailto:info@antugrow.com", "_blank")}
                            >
                                Send Email
                            </Button>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-8 h-8 text-orange-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                            <p className="text-gray-600">Nairobi, Kenya</p>
                            <p className="text-sm text-gray-500 mt-1">Same day delivery available</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
