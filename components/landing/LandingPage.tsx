import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Footer } from "./Footer";
import { PublicNavbar } from "../layout/PublicNavbar";
import {
  Play,
  Menu,
  X,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Star,
  Shield,
  Smartphone,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Scissors,
  Heart,
  Zap,
  Globe,
  CreditCard,
  MessageSquare,
  Award,
  Target,
  Headphones,
  BookOpen,
  Sparkles,
  ChevronRight,
  Palette,
  Brain,
  Rocket,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
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
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    // Also check cookies to ensure consistency
    const hasCookie = document.cookie.includes("accessToken=");

    // User is authenticated if both localStorage and cookie have the token
    setIsAuthenticated(!!(accessToken && user && hasCookie));
  }, []);

  const handleDashboardClick = () => {
    router.push("/home");
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <PublicNavbar
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        onMarketplace={onCustomerSite}
        forceLightTheme={true}
      />

      {/* Hero Section */}
      <section className="hero-padding-y relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-orange-50 to-pink-50"></div>
        <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-3xl"></div>

        <div className="safe-container container-padding-mobile max-w-7xl relative">
          <div className="text-center mb-12 sm:mb-16">
            <div
              className="mb-4 sm:mb-6 border-2 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 inline-flex items-center max-w-full shadow-md rounded-full"
              style={{ backgroundColor: "#fef3c7", borderColor: "#fcd34d" }}
            >
              <Rocket
                className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2 shrink-0"
                style={{ color: "#0f172a" }}
              />
              <span className="sm:inline font-medium">
                Trusted by 120,000+ beauty professionals worldwide
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight px-2 safe-text">
              The Future of{" "}
              <span className="bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent relative inline-block">
                Beauty Business
                <svg
                  className="hidden md:block absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-4 text-primary/30"
                  viewBox="0 0 400 20"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M5 15C100 5 200 5 395 15"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              is Here
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 safe-text">
              Supercharge your salon with AI-powered booking, intelligent
              insights, and seamless customer experiences. Join the beauty
              revolution and grow your business like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
              <Button
                size="lg"
                className="btn-auto-width bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 h-auto shadow-2xl shadow-primary/25"
                onClick={onGetStarted}
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Start Your Revolution</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 flex-shrink-0" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="btn-auto-width text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 h-auto border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary bg-white/80 backdrop-blur-sm"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Watch Demo (2 min)</span>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-500 px-4">
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

          {/* Hero Image */}
          <div className="max-w-6xl mx-auto safe-w-full">
            <div className="relative mx-4 sm:mx-0">
              <div className="hidden sm:block absolute -inset-4 bg-gradient-to-r from-primary/20 to-orange-300/20 rounded-3xl blur-2xl"></div>
              <img
                src={
                  "https://images.unsplash.com/photo-1653548410459-5dffc2cef115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYWxvbiUyMGRhc2hib2FyZCUyMGludGVyZmFjZXxlbnwxfHx8fDE3NTgzMTQ5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                }
                alt="ProBeauty Dashboard Interface"
                className="relative w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl border border-white/20"
              />

              {/* Floating Elements */}
              <div className="hidden md:flex absolute -top-2 -right-2 md:-top-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-primary to-orange-500 rounded-xl md:rounded-2xl items-center justify-center shadow-2xl rotate-12">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white" />
              </div>

              <div className="hidden md:flex absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl items-center justify-center shadow-2xl -rotate-12">
                <Brain className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding-y bg-white relative">
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-medium mt-2">{stat.label}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
              </div>
            ))}
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
        className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-primary border-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              Revolutionary Features
            </Badge>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
              Technology that <span className="text-primary">transforms</span>{" "}
              businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed with one goal: to help your beauty
              business thrive in the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden relative"
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

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding-y bg-white">
        <div className="safe-container container-padding-mobile max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-orange-100 text-primary border-primary/20">
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
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg"
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

        <div className="safe-container container-padding-mobile max-w-4xl text-center relative">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 text-[#1e1e1e]">
            Ready to{" "}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              revolutionize
            </span>{" "}
            your business?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            Join over 120,000 beauty professionals who have already transformed
            their businesses with ProBeauty. Your success story starts today.
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
              className="btn-auto-width text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 h-auto border-2 border-white/20 text-[#1e1e1e] hover:bg-white/10 backdrop-blur-sm"
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
