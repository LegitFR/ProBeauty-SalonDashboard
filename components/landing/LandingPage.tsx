import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Footer } from "./Footer";
import { PublicNavbar } from "../layout/PublicNavbar";
import {
  Play,
  Calendar,
  Users,
  Star,
  Shield,
  Smartphone,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Heart,
  Zap,
  CreditCard,
  Globe,
  MessageSquare,
  Award,
  Headphones,
  Sparkles,
  ChevronRight,
  Brain,
  Rocket,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onCustomerSite: () => void;
}

export function LandingPage({
  onGetStarted,
  onLogin,
  onCustomerSite,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const router = useRouter();

  const navigateWithTranslate = (path: string) => {
    try {
      const lang = localStorage.getItem("pb_lang");
      if (lang && lang !== "en") {
        window.location.href = path;
        return;
      }
    } catch (error) {
      console.error("Failed to read language preference:", error);
    }
    router.push(path);
  };

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    // Also check cookies to ensure consistency
    const hasCookie = document.cookie.includes("accessToken=");

    // User is authenticated if both localStorage and cookie have the token
    setIsAuthenticated(!!(accessToken && user && hasCookie));

    // Handle language changes
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

  const handleDashboardClick = () => {
    navigateWithTranslate("/home");
  };

  const features = [
    {
      icon: Calendar,
      title: "Smart Booking Engine",
      description:
        "AI-powered scheduling that learns from your business patterns",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "AI Business Insights",
      description: "Get intelligent recommendations to grow your revenue",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: CreditCard,
      title: "Seamless Payments",
      description: "Accept payments anywhere with our unified payment system",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Customer Intelligence",
      description: "Deep customer insights and automated marketing campaigns",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Beautiful apps for you and your customers",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with 99.99% uptime guarantee",
      color: "from-gray-600 to-gray-800",
    },
  ];

  const stats = [
    {
      value: "120K+",
      label: "Beauty Professionals",
      change: "+23% this month",
    },
    { value: "8.2M", label: "Appointments Booked", change: "+47% growth" },
    { value: "€2.1B", label: "Revenue Processed", change: "+89% YoY" },
    { value: "99.99%", label: "Uptime SLA", change: "Industry leading" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      business: "Luxe Beauty Studio",
      location: "Los Angeles, CA",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "ProBeauty transformed our business. We increased revenue by 65% in just 6 months.",
      metric: "+65% Revenue",
    },
    {
      name: "Marcus Williams",
      business: "Elite Barbershop",
      location: "New York, NY",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The AI insights are incredible. It predicted our busy periods and helped us optimize staffing.",
      metric: "+40% Efficiency",
    },
    {
      name: "Isabella Martinez",
      business: "Zen Wellness Spa",
      location: "Miami, FL",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Our clients love the seamless booking experience. No-shows dropped by 80%.",
      metric: "-80% No-shows",
    },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "#ECE3DC" }}
    >
      {/* Navigation */}
      <PublicNavbar
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        onMarketplace={onCustomerSite}
        forceLightTheme={true}
      />

      {/* Hero Section */}
      <section className="hero-padding-y relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-orange-50 to-pink-50"></div>
        <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-3xl"></div>

        <div className="safe-container container-padding-mobile max-w-7xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center sm:text-left">
              <div
                className="mb-5 border-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 inline-flex items-center max-w-full shadow-md rounded-full"
                style={{ backgroundColor: "#fef3c7", borderColor: "#fcd34d" }}
              >
                <Rocket
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2 shrink-0"
                  style={{ color: "#0f172a" }}
                />
                <span className="sm:inline font-medium">
                  The all-in-one platform for beauty pros
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight safe-text notranslate">
                {selectedLanguage === "pt" ? (
                  <>
                    Administre o seu salão com a confiança de um profissional.<br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent relative inline"> negócios modernos</span>
                  </>
                ) : selectedLanguage === "fr" ? (
                  <>
                    Gérez votre salon avec la confiance d'une <span className="bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent relative inline">entreprise moderne</span>
                  </>
                ) : (
                  <>
                    Manage your salon with the confidence of a <span className="bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent relative inline">modern business</span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed safe-text notranslate">
                {selectedLanguage === "pt"
                  ? "Agendamento online, gestão de clientes, lembretes automatizados e insights inteligentes numa plataforma incrivelmente simples, criada para o crescimento."
                  : selectedLanguage === "fr"
                  ? "Réservation en ligne, gestion des clients, rappels automatisés et analyses pertinentes, tout sur une plateforme d'une simplicité remarquable conçue pour la croissance."
                  : "Online booking, client management, automated reminders, and smart insights in one beautifully simple platform built for growth."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-start mb-8">
                <Button
                  size="lg"
                  className="btn-auto-width bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 h-auto shadow-2xl shadow-primary/25"
                  onClick={onGetStarted}
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 flex-shrink-0" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="btn-auto-width text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 h-auto border-2 border-[#1e1e1e] hover:border-primary text-gray-700 hover:text-primary backdrop-blur-sm"
                  style={{ backgroundColor: "#ECE3DC" }}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">See it in action</span>
                </Button>
              </div>

              <div className="flex flex-wrap sm:justify-start justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">30-day free trial</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    No credit card required
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-orange-300/20 rounded-3xl blur-2xl"></div>
              <img
                src={"/girl-haircut.svg"}
                alt="ProBeauty Dashboard Interface"
                className="relative w-full h-auto rounded-2xl shadow-2xl border border-white/20 transition-transform hover:scale-105"
              />

              <div
                className="absolute -top-4 right-4 hidden md:flex flex-col gap-2 border border-white/80 rounded-2xl shadow-2xl px-4 py-3"
                style={{ backgroundColor: "#ECE3DC" }}
              >
                <div className="text-xs text-gray-500">Next appointment</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Ava Thompson</p>
                    <p className="text-xs text-gray-500">Today, 4:30 PM</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-4 left-4 hidden md:flex flex-col gap-2 border border-white/80 rounded-2xl shadow-2xl px-4 py-3"
                style={{ backgroundColor: "#ECE3DC" }}
              >
                <div className="text-xs text-gray-500">Revenue this week</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">€12,480</p>
                    <p className="text-xs text-green-600">+18% vs last week</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-primary to-orange-500 rounded-2xl items-center justify-center shadow-2xl rotate-12">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              Trusted by growth-minded salons and studios
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-600">
              <span className="font-semibold">Luxe Studio</span>
              <span className="font-semibold">Radiant Barbers</span>
              <span className="font-semibold">Glow & Co</span>
              <span className="font-semibold">Velvet Spa</span>
              <span className="font-semibold">Blush Atelier</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="section-padding-y relative"
        style={{ backgroundColor: "#ECE3DC" }}
      >
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div
            className="border border-white/80 rounded-3xl shadow-2xl px-6 sm:px-10 py-10"
            style={{ backgroundColor: "#ECE3DC" }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-gray-600 font-medium mt-2">
                      {stat.label}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section
        id="features"
        className="section-padding-y bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-primary border-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              Revolutionary Features
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
              Technology that <span className="text-primary">transforms</span>{" "}
              businesses
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Every feature is designed with one goal: to help your beauty
              business thrive in the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>
                  <CardContent className="p-6 sm:p-8 relative">
                    <div
                      className={`w-14 h-14 bg-linear-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon
                        className="w-7 h-7 text-white"
                        style={{ color: "white" }}
                      />
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                      {feature.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-primary hover:text-primary/80 group-hover:translate-x-2 transition-transform text-sm sm:text-base"
                    >
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section> */}

      <section
        id="features"
        className="section-padding-y"
        style={{ backgroundColor: "#ECE3DC" }}
      >
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
            <div className="text-center sm:text-left">
              <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-[#1e1e1e] border-primary/20">
                <Zap className="w-4 h-4 mr-2" />
                Built for modern salons
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Everything you need to scale, all in one place
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
                Inspired by the best in the industry, ProBeauty blends a sleek
                client experience with powerful tools for your team.
              </p>
            </div>
            <div
              className="border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-8"
              style={{ backgroundColor: "#ECE3DC" }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Your daily overview</p>
                  <p className="font-semibold">Unified, actionable, clear</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: "#ECE3DC" }}
                >
                  <p className="text-xs text-gray-500">Bookings</p>
                  <p className="text-xl font-semibold">124</p>
                </div>
                <div
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: "#ECE3DC" }}
                >
                  <p className="text-xs text-gray-500">No-shows</p>
                  <p className="text-xl font-semibold">2.1%</p>
                </div>
                <div
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: "#ECE3DC" }}
                >
                  <p className="text-xs text-gray-500">New clients</p>
                  <p className="text-xl font-semibold">38</p>
                </div>
                <div
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: "#ECE3DC" }}
                >
                  <p className="text-xs text-gray-500">Avg. ticket</p>
                  <p className="text-xl font-semibold">€86</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 backdrop-blur-sm overflow-hidden relative"
                  style={{ backgroundColor: "#ECE3DC" }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>
                  <CardContent className="p-8 relative">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-primary hover:text-primary/80 group-hover:translate-x-2 transition-transform"
                    >
                      Learn more <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section
        className="section-padding-y"
        style={{ backgroundColor: "#ECE3DC" }}
      >
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-[#1e1e1e] border-primary/20">
              <Heart className="w-4 h-4 mr-2" />
              Built for every beauty business
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              The platform salons, spas, and studios trust
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Tailored workflows for each specialty, from full-service salons to
              boutique wellness studios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Salon",
                image:
                  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Barber",
                image:
                  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Nails",
                image:
                  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Spa",
                image:
                  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Skincare",
                image:
                  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Massage",
                image:
                  "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-3xl shadow-2xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
                  }}
                ></div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-xl font-semibold text-white">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="btn-auto-width bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 h-auto shadow-2xl shadow-primary/25"
              onClick={onGetStarted}
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Get started now
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="section-padding-y"
        style={{ backgroundColor: "#ECE3DC" }}
      >
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div
              className="border border-white/80 rounded-3xl shadow-2xl p-6 sm:p-10"
              style={{ backgroundColor: "#ECE3DC" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client experience</p>
                  <p className="font-semibold">Smooth from booking to review</p>
                </div>
              </div>
              <img
                src={
                  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80"
                }
                alt="Salon experience"
                className="w-full h-auto rounded-2xl transition-transform duration-300 hover:scale-102"
              />
            </div>
            <div className="text-center sm:text-left">
              <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-[#1e1e1e] border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Designed for conversion
              </Badge>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                Turn visitors into loyal regulars
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Your booking flow should feel like a premium experience. We
                refine every touchpoint to reduce drop-off and increase repeat
                visits.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Instant online booking</p>
                    <p className="text-sm text-gray-600">
                      Optimized for mobile with lightning-fast checkout.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Automated reminders</p>
                    <p className="text-sm text-gray-600">
                      Reduce no-shows with smart confirmations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Built-in reviews</p>
                    <p className="text-sm text-gray-600">
                      Collect feedback and build social proof automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section
        className="section-padding-y"
        style={{ backgroundColor: "#ECE3DC" }}
      >
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="text-center sm:text-left">
              <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-[#1e1e1e] border-primary/20">
                <Zap className="w-4 h-4 mr-2" />
                Loved by teams
              </Badge>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                The booking platform clients love and teams rely on
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Built for busy calendars, effortless staff management, and a
                polished client experience from first click to repeat visit.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <p className="text-sm sm:text-base text-gray-700">
                    Powerful calendar with unlimited bookings, clients, and
                    locations.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <p className="text-sm sm:text-base text-gray-700">
                    Advanced insights with a 360-degree view of each client and
                    their preferences.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <p className="text-sm sm:text-base text-gray-700">
                    Crafted to deliver a smooth experience that elevates your
                    brand.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div
                className="rounded-3xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: "#ECE3DC" }}
              >
                <img
                  src={
                    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt="Client profile"
                  className="w-full h-64 object-cover transition-transform hover:scale-105"
                />
              </div>
              <div
                className="rounded-3xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: "#ECE3DC" }}
              >
                <img
                  src={
                    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt="Booking calendar"
                  className="w-full h-64 object-cover transition-transform hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="grid grid-cols-1 gap-6">
              <div
                className="rounded-3xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: "#ECE3DC" }}
              >
                <img
                  src={
                    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt="Marketplace profile"
                  className="w-full h-64 object-cover transition-transform hover:scale-105"
                />
              </div>
              <div
                className="rounded-3xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: "#ECE3DC" }}
              >
                <img
                  src={
                    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt="Marketplace map"
                  className="w-full h-64 object-cover transition-transform hover:scale-105"
                />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-[#1e1e1e] border-primary/20">
                <Globe className="w-4 h-4 mr-2" />
                Marketplace growth
              </Badge>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                The most popular marketplace to grow your business
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Promote your services and reach new clients on the world’s
                largest beauty and wellness marketplace.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <p className="text-sm sm:text-base text-gray-700">
                    Increase online visibility by listing your business on
                    ProBeauty Marketplace.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <p className="text-sm sm:text-base text-gray-700">
                    Reach millions of clients ready to book their next
                    appointment.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <p className="text-sm sm:text-base text-gray-700">
                    Turn visibility into repeat business with automated follow
                    ups.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="section-padding-y"
        style={{ backgroundColor: "#ECE3DC" }}
      >
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-[#1e1e1e] border-primary/20">
              <Heart className="w-4 h-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
              Real results from real beauty professionals
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              See how ProBeauty has transformed thousands of beauty businesses
              worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-0"
                style={{ backgroundColor: "#ECE3DC" }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg transition-transform hover:scale-105"
                    />
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-primary text-primary"
                          />
                        ))}
                      </div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">
                        {testimonial.business}
                      </p>
                      <p className="text-xs text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {testimonial.metric}
                    </Badge>
                  </div>

                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-y bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-orange-500/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>

        <div className="safe-container container-padding-mobile max-w-5xl text-center relative">
          <Badge
            className="mb-4 text-[#1e1e1e] border-white/80"
            style={{ backgroundColor: "#ECE3DC" }}
          >
            <Rocket className="w-4 h-4 mr-2" />
            Start in minutes
          </Badge>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 text-[#1e1e1e]">
            Ready to launch a booking experience that feels
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              {" "}premium{" "}
            </span>
            from day one?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            Join over 120,000 beauty professionals who trust ProBeauty to run
            their day-to-day operations and grow with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 text-sm sm:text-base lg:text-lg px-4 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 h-auto shadow-2xl shadow-primary/25 btn-hero-width"
              onClick={onGetStarted}
            >
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 shrink-0" />
              <span className="sm:inline whitespace-nowrap">
                Start Your 30-Day Free Trial
              </span>
              <span className="sm:hidden text-sm">Start Free Trial</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 shrink-0" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="btn-auto-width text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 h-auto border-2 border-white/20 text-[#1e1e1e] backdrop-blur-sm"
              style={{ backgroundColor: "#ECE3DC" }}
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Schedule a Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-400 px-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Enterprise security</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-primary" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>SOC 2 certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onGetStarted={onGetStarted} onCustomerSite={onCustomerSite} />
    </div>
  );
}
