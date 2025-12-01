import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    ChevronRight,
} from "lucide-react";
export default function SiteFooter() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* --- 1. INTEGRATED CONTACT CTA (Full Width) --- */}
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-white mb-2">
                        Need Help or Bulk Order?
                    </h3>
                    <p className="text-lg text-gray-400">
                        Our team is ready to assist with special requests or
                        large quantities.
                    </p>
                </div>

                {/* --- 2. CONTACT METHODS (3 Columns, Animated) --- */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* PHONE/WHATSAPP */}
                    <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-green-500 hover:bg-gray-800/70 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
                        <div className="w-16 h-16 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-105">
                            <Phone className="w-8 h-8 text-green-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">
                            Phone/WhatsApp
                        </h4>
                        <p className="text-green-400 font-medium mb-3">
                            +254 113 675687
                        </p>
                        <Button
                            variant="outline"
                            className="w-full bg-green-600 hover:bg-green-700 text-white border-green-600"
                            onClick={() =>
                                window.open(
                                    "https://wa.me/254113675687?text=Hi! I'm interested in a bulk order.",
                                    "_blank"
                                )
                            }
                        >
                            WhatsApp Us
                        </Button>
                    </div>

                    {/* EMAIL */}
                    <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-800/70 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
                        <div className="w-16 h-16 bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-105">
                            <Mail className="w-8 h-8 text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">
                            Email Support
                        </h4>
                        <p className="text-blue-400 font-medium mb-3">
                            info@antugrow.com
                        </p>
                        <Button
                            variant="outline"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            onClick={() =>
                                window.open(
                                    "mailto:info@antugrow.com",
                                    "_blank"
                                )
                            }
                        >
                            Send Email
                        </Button>
                    </div>

                    {/* LOCATION */}
                    <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-orange-500 hover:bg-gray-800/70 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
                        <div className="w-16 h-16 bg-orange-900/40 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-105">
                            <MapPin className="w-8 h-8 text-orange-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">
                            Delivery Hub
                        </h4>
                        <p className="text-orange-400 font-medium mb-3">
                            Nairobi, Kenya
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Same-day delivery on most orders
                        </p>
                        <Button
                            variant="outline"
                            className="w-full mt-3 bg-transparent text-gray-400 border-gray-600 hover:bg-gray-700"
                            disabled
                        >
                            View Delivery Zones
                        </Button>
                    </div>
                </div>

                {/* --- 3. MAIN FOOTER LINKS & INFO (4 Columns) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-700 pt-10">
                    {/* COLUMN 1: COMPANY INFO / LOGO */}
                    <div>
                        <Link
                            to="/"
                            className="text-2xl font-bold text-green-500 mb-4 block"
                        >
                            Antugrow Sokoni
                        </Link>
                        <p className="text-sm text-gray-400">
                            Sourcing the freshest farm products directly to your
                            doorstep in Nairobi.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            {/* Animated Social Icons */}
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="text-gray-400 hover:text-green-500 transition-transform duration-300 hover:scale-125"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="text-gray-400 hover:text-green-500 transition-transform duration-300 hover:scale-125"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="text-gray-400 hover:text-green-500 transition-transform duration-300 hover:scale-125"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                    {/* COLUMN 2: QUICK LINKS (Animated Chevron) */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li className="group">
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-green-500 transition-colors flex items-center"
                                >
                                    <ChevronRight className="w-4 h-4 mr-1 text-green-500 transition-transform group-hover:translate-x-1 duration-200" />{" "}
                                    Shop All
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-green-500 transition-colors flex items-center"
                                >
                                    <ChevronRight className="w-4 h-4 mr-1 text-green-500 transition-transform group-hover:translate-x-1 duration-200" />{" "}
                                    About Us
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    to="/faq"
                                    className="text-gray-400 hover:text-green-500 transition-colors flex items-center"
                                >
                                    <ChevronRight className="w-4 h-4 mr-1 text-green-500 transition-transform group-hover:translate-x-1 duration-200" />{" "}
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* COLUMN 3: ACCOUNT & LEGAL (Animated Chevron) */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Account & Legal
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li className="group">
                                <Link
                                    to="/profile"
                                    className="text-gray-400 hover:text-green-500 transition-colors flex items-center"
                                >
                                    <ChevronRight className="w-4 h-4 mr-1 text-green-500 transition-transform group-hover:translate-x-1 duration-200" />{" "}
                                    My Account
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    to="/terms"
                                    className="text-gray-400 hover:text-green-500 transition-colors flex items-center"
                                >
                                    <ChevronRight className="w-4 h-4 mr-1 text-green-500 transition-transform group-hover:translate-x-1 duration-200" />{" "}
                                    Terms of Service
                                </Link>
                            </li>
                            <li className="group">
                                <Link
                                    to="/privacy"
                                    className="text-gray-400 hover:text-green-500 transition-colors flex items-center"
                                >
                                    <ChevronRight className="w-4 h-4 mr-1 text-green-500 transition-transform group-hover:translate-x-1 duration-200" />{" "}
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* COLUMN 4: NEWSLETTER / ADDITIONAL INFO */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Stay Updated
                        </h4>
                        <p className="text-sm mb-4 text-gray-400">
                            Subscribe for weekly deals and product updates.
                        </p>
                        {/* Placeholder for Newsletter Input */}
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm focus:border-green-500"
                        />
                        <Button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
                            Subscribe
                        </Button>
                    </div>
                </div>
                {/* --- 4. COPYRIGHT --- */}
                <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Antugrow Sokoni. All
                    rights reserved.
                </div>
            </div>
        </footer>
    );
}
