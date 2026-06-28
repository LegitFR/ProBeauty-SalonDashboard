"use client";

import { PublicNavbar as Header } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/landing/Footer";
import { useRouter } from "next/navigation";

export default function TermsOfServicePage() {
  const router = useRouter();

  const handleGetStarted = () => router.push("/auth");
  const handleCustomerSite = () => router.push("/marketplace");

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#ECE3DC" }}>
      <Header 
        forceLightTheme={true}
        onGetStarted={handleGetStarted}
        onMarketplace={handleCustomerSite}
      />

      <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="p-8 md:p-12">
          <p className="font-semibold text-sm uppercase tracking-wider mb-2 text-[#1e1e1e]">Terms of Service</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-[#1e1e1e]">ProBeauty Terms of Service</h1>
          <p className="leading-relaxed mb-12 text-[#1e1e1e]">
            These Terms of Service govern your use of the ProBeauty website and services.
            By accessing or using our platform, you agree to be bound by these terms.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">1. Acceptance of Terms</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              By creating an account, booking a service, or otherwise using ProBeauty, you
              accept and agree to comply with these Terms of Service. If you do not agree,
              you must not use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">2. User Accounts</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              You must provide accurate and complete information when creating an account.
              You are responsible for maintaining the confidentiality of your login credentials
              and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">3. Bookings and Payments</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              When you book a service through ProBeauty, you agree to pay the specified
              price. Cancellations and refunds are subject to the individual policies of
              the salon or service provider.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">4. Prohibited Conduct</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              You agree not to use our platform for any unlawful purpose, to harass or abuse
              others, to interfere with the operation of the service, or to attempt to gain
              unauthorized access to our systems.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">5. Intellectual Property</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              All content, trademarks, and data on the ProBeauty platform are the property
              of ProBeauty or its licensors. You may not use, copy, or distribute this
              content without explicit permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">6. Limitation of Liability</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              ProBeauty is a platform connecting users with service providers. We are not
              liable for the quality of services provided by third parties, nor for any
              indirect, incidental, or consequential damages arising from your use of the platform.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">7. Changes to Terms</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              We reserve the right to modify these Terms of Service at any time. Changes will
              be effective immediately upon posting to the platform. Continued use of the
              service constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Contact Us</h2>
            <p className="leading-relaxed mb-0 text-[#1e1e1e]">
              If you have any questions about these Terms of Service, please contact us at
              <a className="hover:underline ml-1 font-medium text-[#f7931d]" href="mailto:support@probeautyapp.net">support@probeautyapp.net</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer 
        onGetStarted={handleGetStarted}
        onCustomerSite={handleCustomerSite}
      />
    </div>
  );
}
