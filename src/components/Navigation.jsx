import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    ShoppingCart,
    User,
    LogOut,
    Settings,
    Package,
    ChevronRight,
} from "lucide-react";

// Context
import { useProductContext } from "../providers/ProductProvider";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation({
    showBackButton = false,
    currentProduct = null,
    // Mocking a user object for demonstration. Pass this via props or AuthContext.
    user = { name: "Antugrow", email: "antugrow@example.com", image: null },
}) {
    const { cartItems } = useProductContext();
    const cartCount = cartItems?.length ?? 0;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* --- 1. LOGO & BRANDING --- */}
                    <div className="flex items-center gap-4">
                        {showBackButton && (
                            <Link to="/">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hidden sm:flex -ml-2 text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    <span className="sr-only">Back</span>
                                </Button>
                            </Link>
                        )}

                        <Link
                            to="/"
                            className="flex items-center gap-3 transition-opacity hover:opacity-90"
                        >
                            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-gray-200 shadow-sm sm:h-10 sm:w-10">
                                <img
                                    src="/ANTUGROW-DARK.webp"
                                    alt="Antugrow Logo"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                                    Antugrow{" "}
                                    <span className="text-green-600">
                                        Sokoni
                                    </span>
                                </span>
                                <span className="hidden text-[10px] font-medium text-muted-foreground sm:inline-block">
                                    Fresh Farm Products
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* --- 2. ACTIONS (RIGHT SIDE) --- */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* CTA: Sell Product - Highlights this as a primary action */}
                        <Link to="/list-product">
                            <Button
                                size="sm"
                                className="hidden bg-green-600 hover:bg-green-700 text-white shadow-sm sm:flex"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Sell Product
                            </Button>
                            {/* Mobile Icon Only */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="flex sm:hidden text-green-600"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </Link>

                        {/* Cart Button */}
                        <Link to="/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative group"
                            >
                                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-green-600 transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                )}
                                <span className="sr-only">Cart</span>
                            </Button>
                        </Link>

                        {/* Separator for desktop visual clarity */}
                        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

                        {/* --- 3. PROFILE SECTION --- */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full h-9 w-9 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ml-1"
                                    >
                                        <Avatar className="h-9 w-9 border border-gray-200">
                                            <AvatarImage
                                                src={user.image}
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="bg-green-50 text-green-700 font-medium">
                                                {user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <Link to="/profile">Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Package className="mr-2 h-4 w-4" />
                                            <Link to="/orders">My Orders</Link>
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </DropdownMenuItem> */}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to="/login">
                                <Button size="sm" variant="outline">
                                    Log in
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* --- 4. OPTIONAL BREADCRUMB / SUB-NAV --- */}
                {currentProduct && (
                    <div className="pb-3 animate-in fade-in slide-in-from-top-1 duration-300">
                        <nav className="flex items-center text-sm text-muted-foreground">
                            <Link
                                to="/"
                                className="hover:text-green-600 transition-colors flex items-center"
                            >
                                <ArrowLeft className="w-3 h-3 mr-1 sm:hidden" />
                                Products
                            </Link>
                            <ChevronRight className="h-4 w-4 mx-1 text-gray-300" />
                            <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-md">
                                {currentProduct.name}
                            </span>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
