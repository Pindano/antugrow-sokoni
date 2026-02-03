import React from "react";
import { User, Lock, ArrowRight } from "lucide-react";

export default function Login() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">
            {/* Left Section: Immersive Brand Visual */}
            <div className="hidden lg:flex lg:w-3/5 xl:w-3/5 bg-[#f0fdf4] relative items-center justify-center p-12">
                {/* Background Decorative Shapes */}
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
                        Sell and buy{" "}
                        <span className="text-emerald-500">Farm Produce</span>{" "}
                        faster.
                    </h1>
                    <p className="text-xl text-emerald-700/80 mb-8 leading-relaxed">
                        Welcome back to Antugrow Sokoni.Your direct link to
                        fresh and affordable farm produce.
                    </p>

                    {/* Abstract Illustration (replaces the phone/man in image) */}
                    <div className="relative w-full h-80 bg-emerald-500 rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-400 opacity-90"></div>
                        <div className="z-10 bg-white/20 backdrop-blur-md p-8 rounded-2xl border border-white/30 shadow-inner">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-32 bg-white/40 rounded"></div>
                                <div className="h-2 w-48 bg-white/40 rounded"></div>
                                <div className="h-2 w-40 bg-white/20 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Login Form */}
            <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col justify-center px-8 md:px-16 lg:px-12 xl:px-20 bg-white">
                <div className="mb-12">
                    {/* Avatar Icon */}
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <User size={32} className="text-emerald-600" />
                            {/* <img
                                src="/ANTUGROW-DARK.webp"
                                alt="Antugrow Logo"
                                width={48}
                                height={48}
                            /> */}
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Antugrow Sokoni
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Please login to your Antugrow account
                    </p>
                </div>

                <form className="space-y-8">
                    {/* Username */}
                    <div className="group border-b-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Username
                        </label>
                        <div className="flex items-center py-2">
                            <User size={20} className="text-emerald-500 mr-3" />
                            <input
                                type="text"
                                // defaultValue="CSSScript.Com"
                                className="w-full bg-transparent outline-none text-gray-800 text-lg placeholder-gray-300"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="group border-b-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Password
                        </label>
                        <div className="flex items-center py-2">
                            <Lock
                                size={20}
                                className="text-gray-300 group-focus-within:text-emerald-500 mr-3 transition-colors"
                            />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-transparent outline-none text-gray-800 text-lg placeholder-gray-300"
                            />
                        </div>
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                className="text-xs text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    {/* Login Action */}
                    <button
                        type="submit"
                        className="w-full bg-[#2dd4bf] hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-2 group"
                    >
                        LOGIN
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-gray-500">
                        New to Antugrow?{" "}
                        <a
                            href="#"
                            className="text-emerald-600 font-bold hover:underline"
                        >
                            Create Account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
