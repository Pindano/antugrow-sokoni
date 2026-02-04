import React, { useState, useEffect } from "react";
import { User, Lock, ArrowRight, Mail, Phone, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function AuthPage() {
    // State to toggle between Login and Signup
    const [isLogin, setIsLogin] = useState(true);
    const [logginIn, setLoggingIn] = useState(false);
    const [signingUp, setSigningUp] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: "",
    });
    const [signupDetails, setSignupDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });
    const navigate = useNavigate();

    // Agricultural products data
    const products = [
        {
            id: 1,
            name: "Fresh Maize",
            price: "KES 3,500 / Bag",
            img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800",
        },
        {
            id: 3,
            name: "Hass Avocados",
            price: "KES 40 / Piece",
            img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800",
        },
        {
            id: 4,
            name: "Purple Onions",
            price: "KES 120 / Kg",
            img: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800",
        },
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginDetails.email,
                password: loginDetails.password,
            });
            if (error) {
                console.error("Login error:", error);
                toast.error("Login failed. Please check your credentials.");
                return;
            }
            console.log(data);
            navigate("/");
        } catch (error) {
            console.error("Unexpected error during login:", error);
        } finally {
            setLoggingIn(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setSigningUp(true);
        console.log("Signup details:", signupDetails);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: signupDetails.email,
                password: signupDetails.password,
                options: {
                    data: {
                        user_type: "sokoni",
                        full_name: signupDetails.fullName,
                        phone: signupDetails.phone,
                    },
                },
            });

            if (error) {
                // console.error("Signup error:", error);
                toast.error(error.message);
                throw new Error("Signup failed");
            }
            setIsLogin(true);
            handleLogin(e);
        } catch (error) {
            console.error("Signup error:", error);
        } finally {
            setSigningUp(false);
        }
    };

    // Automatically switch products every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Left Section: Immersive Brand Visual */}
            <div className="hidden lg:flex lg:w-3/5 xl:w-3/5 bg-[#f0fdf4] relative items-center justify-center p-12">
                <div className="absolute top-0 left-0 w-full h-full opacity-40">
                    <svg
                        viewBox="0 0 500 500"
                        className="absolute -top-20 -left-20 w-96 h-96 text-emerald-200 fill-current"
                    >
                        <path d="M414.4,142.7C442.1,192,447,260,422,316.4C397,372.7,342,417.3,277,434C212,450.7,137,439.3,91.7,398.7C46.3,358,30.7,288,43.3,227.7C56,167.3,97,116.7,152.7,80.3C208.3,44,278.7,22,339.4,45.3C400,68.7,451,137.3,414.4,142.7Z" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-6xl font-black text-emerald-900 leading-tight mb-6">
                        {isLogin ? "Sell and buy " : "Start your "}
                        <span className="text-emerald-500">
                            {isLogin ? "Farm Produce" : "Farming Journey"}
                        </span>{" "}
                        faster.
                    </h1>
                    <p className="text-xl text-emerald-700/80 mb-8 leading-relaxed">
                        {isLogin
                            ? "Welcome back to Antugrow Sokoni. Your direct link to fresh and affordable farm produce."
                            : "Join Antugrow Sokoni today. Connect with thousands of farmers and buyers across the region."}
                    </p>

                    {/* Dynamic Carousel Container */}
                    <div className="relative w-full h-[400px] rounded-[2.5rem] shadow-2xl overflow-hidden group">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    index === currentIndex
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            >
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[4000ms]"
                                />
                                {/* Glassmorphism Label */}
                                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-1">
                                                Live Marketplace
                                            </p>
                                            <h3 className="text-2xl font-bold text-white">
                                                {product.name}
                                            </h3>
                                        </div>
                                        <div className="bg-white/90 px-4 py-2 rounded-xl">
                                            <p className="text-emerald-800 font-bold text-sm">
                                                {product.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Progress Indicators */}
                        <div className="absolute top-6 right-8 flex gap-2">
                            {products.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        i === currentIndex
                                            ? "w-8 bg-white"
                                            : "w-2 bg-white/40"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Form Content */}
            <div className="w-full lg:w-2/5 xl:w-2/5 flex flex-col justify-center px-8 md:px-16 lg:px-12 xl:px-20 bg-white overflow-y-auto">
                <div className="mb-10">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            {isLogin ? (
                                <User size={28} />
                            ) : (
                                <UserPlus size={28} />
                            )}
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {isLogin
                            ? "Please login to your Antugrow account"
                            : "Fill in your details to get started"}
                    </p>
                </div>

                <form
                    onSubmit={isLogin ? handleLogin : handleSignup}
                    className="space-y-6"
                >
                    {!isLogin && (
                        <div className="group border-b-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Full Name
                            </label>
                            <div className="flex items-center py-2">
                                <User
                                    size={18}
                                    className="text-emerald-500 mr-3"
                                />
                                <input
                                    onChange={(e) => {
                                        setSignupDetails({
                                            ...signupDetails,
                                            fullName: e.target.value,
                                        });
                                    }}
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full bg-transparent outline-none text-gray-800 text-lg placeholder-gray-300"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="group border-b-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Email Address
                        </label>
                        <div className="flex items-center py-2">
                            <Mail size={18} className="text-emerald-500 mr-3" />
                            <input
                                onChange={(e) => {
                                    isLogin
                                        ? setLoginDetails({
                                              ...loginDetails,
                                              email: e.target.value,
                                          })
                                        : setSignupDetails({
                                              ...signupDetails,
                                              email: e.target.value,
                                          });
                                }}
                                required
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-transparent outline-none text-gray-800 text-lg placeholder-gray-300"
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="group border-b-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Phone Number
                            </label>
                            <div className="flex items-center py-2">
                                <Phone
                                    size={18}
                                    className="text-emerald-500 mr-3"
                                />
                                <input
                                    onChange={(e) => {
                                        setSignupDetails({
                                            ...signupDetails,
                                            phone: e.target.value,
                                        });
                                    }}
                                    required
                                    type="tel"
                                    placeholder="+254 700 000000"
                                    className="w-full bg-transparent outline-none text-gray-800 text-lg placeholder-gray-300"
                                />
                            </div>
                        </div>
                    )}

                    <div className="group border-b-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Password
                        </label>
                        <div className="flex items-center py-2">
                            <Lock
                                size={18}
                                className="text-gray-300 group-focus-within:text-emerald-500 mr-3 transition-colors"
                            />
                            <input
                                onChange={(e) => {
                                    isLogin
                                        ? setLoginDetails({
                                              ...loginDetails,
                                              password: e.target.value,
                                          })
                                        : setSignupDetails({
                                              ...signupDetails,
                                              password: e.target.value,
                                          });
                                }}
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-transparent outline-none text-gray-800 text-lg placeholder-gray-300"
                            />
                        </div>
                        {isLogin && (
                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    className="text-xs text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2dd4bf] hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-2 group mt-4"
                    >
                        {logginIn || signingUp ? (
                            <Loader className="animate-spin w-4 h-4" />
                        ) : null}
                        {isLogin ? "LOGIN" : "SIGN UP"}
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-500">
                        {isLogin
                            ? "New to Antugrow?"
                            : "Already have an account?"}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-emerald-600 font-bold hover:underline"
                        >
                            {isLogin ? "Create Account" : "Login Instead"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
