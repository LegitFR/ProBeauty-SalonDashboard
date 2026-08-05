import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Globe,
  Smartphone,
  CreditCard,
  Shield,
  Award,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface FooterProps {
  onGetStarted: () => void;
  onCustomerSite: () => void;
}

export function Footer({ onGetStarted, onCustomerSite }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("pb_lang");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
    const handleLanguageChange = () => {
      const nextLanguage = localStorage.getItem("pb_lang");
      if (nextLanguage) {
        setSelectedLanguage(nextLanguage);
      }
    };
    window.addEventListener("pb_lang_change", handleLanguageChange);
    return () => {
      window.removeEventListener("pb_lang_change", handleLanguageChange);
    };
  }, []);

  const productLinks = [
    { name: "Booking System", href: "https://pro-beauty-web.vercel.app/" },
    // { name: "Point of Sale", href: "#" },
    { name: "Customer Management", href: "/customer" },
    { name: "Staff Scheduling", href: "/staff" },
    { name: "Marketing Tools", href: "/home" },
    { name: "Business Analytics", href: "#" },
    { name: "Mobile Apps", href: "https://play.google.com/store/apps/details?id=com.probeautyapp" },
    // { name: "Payment Processing", href: "#" },
  ];

  const businessTypeLinks = [
    { name: "Hair Salons", href: "/marketplace?service=Hair+Salons" },
    { name: "Nail Salons", href: "/marketplace?service=Nail+Salons" },
    { name: "Spas & Wellness", href: "/marketplace?service=Spas+%26+Wellness" },
    { name: "Barbershops", href: "/marketplace?service=Barbershops" },
    { name: "Beauty Clinics", href: "/marketplace?service=Beauty+Clinics" },
    { name: "Massage Therapy", href: "/marketplace?service=Massage+Therapy" },
    { name: "Tattoo Studios", href: "/marketplace?service=Tattoo+Studios" },
    { name: "Fitness Studios", href: "/marketplace?service=Fitness+Studios" },
  ];

  const companyLinks = [
    { name: "Privacy Policy", href: "/privacy_policy" },
    { name: "Terms of Service", href: "/terms_of_service" },
  ];

  const features = [
    { icon: Calendar, text: "24/7 Online Booking" },
    { icon: CreditCard, text: "Secure Payments" },
    { icon: Smartphone, text: "Mobile Apps" },
    { icon: Shield, text: "Bank-Level Security" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center mb-6">
              <Image
                src="/probeauty-footer.svg"
                alt="Probeauty"
                width={190}
                height={50}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The world's leading booking software for beauty and wellness
              businesses. Trusted by over 50,000 businesses worldwide to grow
              their revenue and streamline operations.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-400">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">00351 913746748</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">
                  suporte@probeautyapp.net
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span translate="no" className="text-sm text-gray-400 notranslate">Ferreiros, Amares, Portugal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Facebook className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Youtube className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => {
                let displayName = link.name;
                let isPtOverride = false;
                if (selectedLanguage === "pt") {
                  if (link.name === "Mobile Apps") {
                    displayName = "Aplicações móveis";
                    isPtOverride = true;
                  } else if (link.name === "Customer Management") {
                    displayName = "Gestão de pessoal";
                    isPtOverride = true;
                  }
                }
                return (
                  <li key={index}>
                    <a
                      href={link.href}
                      className={`text-gray-400 hover:text-white transition-colors text-sm ${isPtOverride ? "notranslate" : ""}`}
                    >
                      {displayName}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Business Types */}
          <div>
            <h3 className="font-semibold text-white mb-4">Business Types</h3>
            <ul className="space-y-3">
              {businessTypeLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay updated</h3>
              <p className="text-gray-400">
                Get the latest news, tips, and updates from our team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 px-4 sm:px-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              <Button className="bg-primary text-white hover:bg-primary/90 px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="btn-auto-width bg-primary text-white hover:bg-primary/90"
                onClick={onGetStarted}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="btn-auto-width btn-find-salons border-gray-600 hover:bg-gray-800 hover:text-white"
                onClick={onCustomerSite}
              >
                <Globe className="w-4 h-4 mr-2" />
                Find Salons
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} ProBeauty. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <a
                  href="/terms_of_service"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/privacy_policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>

              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <select className="bg-transparent text-gray-400 text-sm border-none focus:outline-none">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">
                  Available in 25+ countries
                </span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
