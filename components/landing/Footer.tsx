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

interface FooterProps {
  onGetStarted: () => void;
  onCustomerSite: () => void;
}

export function Footer({ onGetStarted, onCustomerSite }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: "Booking System", href: "#" },
    { name: "Point of Sale", href: "#" },
    { name: "Customer Management", href: "#" },
    { name: "Staff Scheduling", href: "#" },
    { name: "Marketing Tools", href: "#" },
    { name: "Business Analytics", href: "#" },
    { name: "Mobile Apps", href: "#" },
    { name: "Payment Processing", href: "#" },
  ];

  const businessTypeLinks = [
    { name: "Hair Salons", href: "#" },
    { name: "Nail Salons", href: "#" },
    { name: "Spas & Wellness", href: "#" },
    { name: "Barbershops", href: "#" },
    { name: "Beauty Clinics", href: "#" },
    { name: "Massage Therapy", href: "#" },
    { name: "Tattoo Studios", href: "#" },
    { name: "Fitness Studios", href: "#" },
  ];

  const resourceLinks = [
    { name: "Help Center", href: "#" },
    { name: "API Documentation", href: "#" },
    { name: "Webinars", href: "#" },
    { name: "Case Studies", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Templates", href: "#" },
    { name: "Training Videos", href: "#" },
    { name: "Community Forum", href: "#" },
  ];

  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Investors", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Security", href: "#" },
    { name: "Privacy Policy", href: "#" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold">Probeauty</span>
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
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">
                  support@probeauty.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-400">San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
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

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
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
                className="btn-auto-width border-gray-600 text-black hover:bg-gray-800"
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
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
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
