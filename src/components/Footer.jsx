"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#1F3C88] text-white py-12">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">

                    {/* ABOUT */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider relative inline-block">
                            About
                            <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gray-400"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="https://www.metadologie.com/#aboutus" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
                                    About Metadologie
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* OUR PRODUCTS */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider relative inline-block">
                            Our Products
                            <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gray-400"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li><Link href="https://www.metadologie.com/ourproducts/MoneyEase-TaxAssistant" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">MoneyEase-TaxAssistant</Link></li>
                            <li><Link href="https://www.metadologie.com/ourproducts/DocsBag" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">DocsBag</Link></li>
                            <li><Link href="https://www.metadologie.com/ourproducts/M-Quote" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">M-Quote</Link></li>
                            <li><Link href="https://www.metadologie.com/ourproducts/M-Pay" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">M-Pay</Link></li>
                        </ul>
                    </div>

                    {/* CONTACT - INDIA & USA */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider relative inline-block mb-6">
                            Contact
                            <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gray-400"></span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* India */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wide">India</h4>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-300 mt-0.5 shrink-0" />
                                    <p className="text-sm leading-relaxed">
                                        4th Floor, Eden Heights, Mansarovar,<br />
                                        Jaipur, Rajasthan 302020
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-300 shrink-0" />
                                    <p className="text-sm">+91 7976415178</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-300 shrink-0" />
                                    <p className="text-sm">info@metadologie.com</p>
                                </div>
                            </div>

                            {/* USA */}
                            <div className="space-y-4 border-l border-gray-500 md:pl-8 -ml-4 md:ml-0 pl-4">
                                <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wide">USA</h4>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-300 mt-0.5 shrink-0" />
                                    <p className="text-sm leading-relaxed">
                                        Metadologie HQ, 2501 SW Trenton Street,<br />
                                        #1152, Seattle, WA 98106, US
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-300 shrink-0" />
                                    <p className="text-sm">+1 206-707-8600</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-300 shrink-0" />
                                    <p className="text-sm">sales@metadologie.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-300 text-center md:text-left">
                        © Copyrights Metadologie 2026.All other trademarks are property of their respective owners.
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="text-lg text-white font-medium">Follow Us</span>
                        <Link href="https://www.linkedin.com/company/metadologie/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                            <Linkedin className="h-6 w-6" />
                        </Link>
                        <Link href="https://www.instagram.com/metadologie/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                            <Instagram className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
