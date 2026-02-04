export const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md transition-all duration-500">
            <div className="relative flex flex-col items-center">
                {/* Animated Icon Container */}
                <div className="relative flex h-16 w-16 items-center justify-center">
                    {/* Outer glow */}
                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20 duration-1000"></div>

                    {/* Spinning Ring */}
                    <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin"></div>

                    {/* Center Logo/Dot */}
                    <div className="absolute h-3 w-3 rounded-full bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.5)]"></div>
                </div>

                {/* Text with typewriter blink effect or simple fade */}
                <div className="mt-6 space-y-2 text-center">
                    <p className="text-sm text-slate-500 animate-pulse">
                        You will be redirected shortly...
                    </p>
                </div>
            </div>
        </div>
    );
};
