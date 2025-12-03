import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Leaf, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function WelcomeHeader({ searchTerm, setSearchTerm, onSearch }) {
    const popularSearches = ["Avocados", "Kales", "Tomatoes", "Passion Fruits"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // A curated list of 6 distinct high-quality farm images
    const backgroundImages = [
        "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?q=80&w=2070", // Vibrant Veggies
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070", // Market Stall
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070", // Avocados
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2070", // Fresh Tomatoes
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070", // Potatoes/Roots
        "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974", // Fresh Leafy Greens
        "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?q=80&w=2070", // Farmers market table
        "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=2070", // Carrots
        "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=2070", // Berries fresh
        "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=2070", // Passion bunch
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?q=80&w=2070", // Herbs in market
    ];

    // Cycle through images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <header className="relative overflow-hidden bg-green-900">
            {/* --- BACKGROUND SLIDESHOW --- */}
            {/* We render ALL images but change opacity to create a cross-fade effect */}
            <div className="absolute inset-0 z-0">
                {backgroundImages.map((img, index) => (
                    <div
                        key={img}
                        className={`
              absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out
              ${
                  index === currentImageIndex
                      ? "opacity-60 scale-105"
                      : "opacity-0 scale-100"
              }
            `}
                        style={{
                            backgroundImage: `url('${img}')`,
                            // Using mix-blend to tint the images with the green background
                            mixBlendMode: "overlay",
                        }}
                    />
                ))}
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/30 z-10" />
                {/* Gradient overlay to smooth the bottom edge */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-transparent to-black/20 z-10" />
            </div>

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center text-white">
                {/* Title */}
                <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-2xl tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Karibu <span className="text-green-300">Sokoni!</span>
                </h1>

                <p className="text-lg sm:text-2xl text-green-50 max-w-2xl mx-auto mt-4 font-medium drop-shadow-md animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-backwards delay-200">
                    Your direct link to fresh, affordable farm produce.
                </p>

                {/* Search Bar Container */}
                <div className="max-w-xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-backwards delay-300">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5 transition-colors group-focus-within:text-green-300" />

                        <Input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && onSearch && onSearch()
                            }
                            placeholder="Search for Passion, Kales..."
                            className="
                w-full pl-12 pr-4 py-6 text-lg rounded-2xl border border-white/30
                bg-white/10 backdrop-blur-md text-white
                placeholder:text-white/60
                focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:border-white/50
                shadow-2xl transition-all
              "
                        />
                    </div>

                    {/* Popular Searches */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {popularSearches.map((term) => (
                            <button
                                key={term}
                                onClick={() => setSearchTerm(term)}
                                className="
                  px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide
                  bg-black/30 hover:bg-green-500/80
                  border border-white/10 backdrop-blur-md
                  text-white transition-all hover:scale-105 active:scale-95
                  shadow-lg
                "
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* FEATURE HIGHLIGHTS */}
            <div className="hidden md:block relative z-20 bg-white/95 backdrop-blur-md text-gray-700 py-8 border-t border-white/20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Farm Fresh",
                            desc: "Direct from local farmers",
                            icon: Leaf,
                        },
                        {
                            title: "Best Value",
                            desc: "Wholesale & retail pricing",
                            icon: ShoppingCart,
                        },
                        {
                            title: "Swift Delivery",
                            desc: "Fast & reliable delivery",
                            icon: Clock,
                        },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={i}
                                className="
                  bg-green-50/50 rounded-xl p-4 shadow-sm border border-green-100/50
                  flex items-center gap-4 justify-center
                  hover:shadow-md hover:bg-white hover:-translate-y-1 transition-all duration-300 group
                  cursor-default
                "
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border border-green-100 group-hover:bg-green-600 group-hover:border-green-600 transition-colors">
                                    <Icon className="w-6 h-6 text-green-700 group-hover:text-white transition-colors" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-base">
                                        {item.title}
                                    </p>
                                    <p className="text-sm text-gray-500 group-hover:text-gray-600">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}
