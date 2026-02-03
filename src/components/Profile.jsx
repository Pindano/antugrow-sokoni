import React, { useState } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Bell,
    Shield,
    LogOut,
    ChevronRight,
    ExternalLink,
    MessageSquare,
    Zap,
    Gift,
} from "lucide-react";
import { Navigation } from "./Navigation";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("personal"); // State to handle tab switching

    const user = {
        name: "Alex Thompson",
        role: "Premium Member",
        email: "alex.t@antugrow.com",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navigation />

            {/* Profile Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group">
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-28 h-28 rounded-3xl object-cover ring-4 ring-emerald-50"
                        />
                        <button className="absolute bottom-1 right-1 bg-emerald-500 p-2 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                            <Camera size={16} />
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {user.name}
                        </h1>
                        <p className="text-emerald-600 font-semibold mb-2">
                            {user.role}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Mail size={14} /> {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin size={14} /> San Francisco, CA
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Nav */}
                <div className="lg:col-span-3 space-y-2">
                    <SidebarItem
                        icon={<User size={18} />}
                        label="Personal Info"
                        active={activeTab === "personal"}
                        onClick={() => setActiveTab("personal")}
                    />
                    <SidebarItem
                        icon={<Bell size={18} />}
                        label="Notifications"
                        active={activeTab === "notifications"}
                        onClick={() => setActiveTab("notifications")}
                    />
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <SidebarItem
                            icon={<LogOut size={18} />}
                            label="Log Out"
                            color="text-red-500"
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    {activeTab === "personal" ? (
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                            <div className="p-6 border-b border-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Account Details
                                </h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup
                                    label="Full Name"
                                    value="Alex Thompson"
                                />
                                <InputGroup
                                    label="Email Address"
                                    value="alex.t@antugrow.com"
                                />
                                <InputGroup
                                    label="Phone Number"
                                    value="+1 (555) 000-0000"
                                />
                                <InputGroup
                                    label="Organization"
                                    value="Antugrow Creative"
                                />
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none resize-none"
                                        rows="4"
                                        defaultValue="Passionate about scaling digital solutions..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex justify-end">
                                <button className="text-emerald-600 font-bold text-sm hover:underline">
                                    Save Changes
                                </button>
                            </div>
                        </section>
                    ) : (
                        /* Notifications Tab Content */
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                            <div className="p-6 border-b border-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Notification Preferences
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Control how Antugrow reaches out to you.
                                </p>
                            </div>

                            <div className="p-6 space-y-1">
                                <NotificationToggle
                                    title="Email Notifications"
                                    description="Receive daily summaries and activity reports via email."
                                    icon={
                                        <Mail
                                            className="text-blue-500"
                                            size={20}
                                        />
                                    }
                                    defaultChecked
                                />
                                <NotificationToggle
                                    title="Growth Insights"
                                    description="Periodic tips on how to grow your business faster."
                                    icon={
                                        <Zap
                                            className="text-amber-500"
                                            size={20}
                                        />
                                    }
                                />
                                <NotificationToggle
                                    title="Direct Messages"
                                    description="Receive alerts when a team member messages you."
                                    icon={
                                        <MessageSquare
                                            className="text-purple-500"
                                            size={20}
                                        />
                                    }
                                    defaultChecked
                                />
                                <NotificationToggle
                                    title="Offers & Promotions"
                                    description="Be the first to know about discounts and new features."
                                    icon={
                                        <Gift
                                            className="text-rose-500"
                                            size={20}
                                        />
                                    }
                                />
                            </div>

                            <div className="px-6 py-4 bg-emerald-50/50 flex items-center justify-between">
                                <span className="text-xs text-emerald-800 font-medium italic"></span>
                                <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700">
                                    Update Settings
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

// Custom Toggle Component for Notifications
function NotificationToggle({
    title,
    description,
    icon,
    defaultChecked = false,
    disabled = false,
}) {
    return (
        <div className="flex items-start justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className="flex gap-4">
                <div className="mt-1 p-2 bg-white rounded-lg border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-gray-800 leading-tight">
                        {title}
                    </h4>
                    <p className="text-sm text-gray-500 max-w-md">
                        {description}
                    </p>
                </div>
            </div>
            <label
                className={`relative inline-flex items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
                <input
                    type="checkbox"
                    defaultChecked={defaultChecked}
                    disabled={disabled}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
        </div>
    );
}

function SidebarItem({
    icon,
    label,
    active = false,
    color = "text-gray-600",
    onClick,
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : `${color} hover:bg-gray-100`
            }`}
        >
            {icon}
            <span className="flex-1 text-left">{label}</span>
            {active && <ChevronRight size={16} />}
        </button>
    );
}

function InputGroup({ label, value }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                {label}
            </label>
            <input
                type="text"
                defaultValue={value}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none"
            />
        </div>
    );
}
