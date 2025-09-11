import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🍎</span>
                    </div>
                    <CardTitle className="text-2xl text-gray-900">Product Not Found</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600">Sorry, the product you're looking for doesn't exist or may have been removed.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild variant="outline" className="flex-1 bg-transparent">
                            <Link to="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Link>
                        </Button>
                        <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                            <Link to="/">
                                <Home className="w-4 h-4 mr-2" />
                                Browse Products
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
