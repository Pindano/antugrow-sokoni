
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Plus } from "lucide-react"

export function Navigation({ showBackButton = false, currentProduct = null }) {
    return (
        <nav className="bg-white sticky top-0 z-40 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    <Link to="/sokoni" className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <img
                            src="/ANTUGROW-DARK.webp"
                            alt="Antugrow Logo"
                            className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                <span className="sm:hidden">Antugrow</span>
                <span className="hidden sm:inline">Antugrow Sokoni</span>
              </span>
                            <span className="text-xs text-green-600 font-medium hidden sm:block">Fresh Farm Products</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-1 sm:gap-3">
                        {showBackButton && (
                            <Link to="/">
                                <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50 bg-transparent">
                                    <ArrowLeft className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Back to Products</span>
                                </Button>
                            </Link>
                        )}

                        {!showBackButton && (
                            <Link to="/">
                                <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-700">
                                    <Home className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">All Products</span>
                                </Button>
                            </Link>
                        )}

                        <Link to="/list-product">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                            >
                                <Plus className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">List Product</span>
                            </Button>
                        </Link>

                        <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-4"
                            onClick={() =>
                                window.open("https://wa.me/254700123456?text=Hi! I'm interested in ordering fruits", "_blank")
                            }
                        >
                            <span className="sm:hidden">Contact</span>
                            <span className="hidden sm:inline">Contact Us</span>
                        </Button>
                    </div>
                </div>

                {currentProduct && (
                    <div className="pb-3 px-1 sm:px-0">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-green-600 transition-colors">
                                Products
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate">{currentProduct.name}</span>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
