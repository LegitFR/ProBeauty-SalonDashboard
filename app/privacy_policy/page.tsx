import { PublicNavbar as Header } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#ECE3DC" }}>
      <Header forceLightTheme={true} />

      <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="p-8 md:p-12">
          <p className="font-semibold text-sm uppercase tracking-wider mb-2 text-[#1e1e1e]">Privacy Policy</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-[#1e1e1e]">Pro Beauty Privacy Policy</h1>
          <p className="leading-relaxed mb-12 text-[#1e1e1e]">
            This Privacy Policy explains how Pro Beauty collects, uses, shares,
            and protects personal data when you use our website and services.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Introduction</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              Pro Beauty is committed to protecting the privacy of customers,
              partners, and visitors. This policy applies to our website and any
              Pro Beauty services, including booking and ordering.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Contacting us</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              If you have any questions, comments, or requests regarding this
              policy, please contact us at
              <a className="hover:underline ml-1 font-medium text-[#f7931d]" href="mailto:privacy@probeautyapp.net">privacy@probeautyapp.net</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">
              What information do we collect and how do we use it?
            </h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              We collect information you provide directly, such as your name,
              email address, phone number, and booking or order details. We also
              collect technical data and usage information when you browse our
              site, including device identifiers, IP address, and interaction
              data. We use this information to deliver our services, improve the
              platform, and keep your account secure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Legal bases for processing</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              We process personal data when it is necessary to perform a
              contract with you, when we have legitimate interests, when you
              consent, or when we are required to comply with legal obligations.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Who we share data with</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              We share relevant information with salons and service providers so
              they can fulfill your bookings, orders, and support requests. We
              also work with trusted service providers for hosting, analytics,
              communications, and payments. We do not sell personal data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Where we store data</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              Data may be processed and stored in regions where we or our
              service providers operate. We put appropriate safeguards in place
              to protect personal data when transferred internationally.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">How we protect data</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              We use administrative, technical, and physical safeguards to help
              protect personal data. While we work to secure your data, no
              method of transmission or storage is entirely secure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Payment processing</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              Payments are processed by trusted payment providers. Card details
              are handled by those providers; Pro Beauty only receives limited
              payment metadata necessary to complete your transaction.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">External sites</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              Our services may include links to third-party sites. We are not
              responsible for their privacy practices. Please review their
              policies before providing any personal data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">How long we keep data</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              We retain personal data only for as long as necessary to provide
              our services, comply with legal obligations, resolve disputes, and
              enforce agreements. Some data may be retained longer if required
              by law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Aggregated data</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              We may anonymize data and use aggregated information for
              analytics and service improvements. This information does not
              identify you.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Your rights</h2>
            <p className="leading-relaxed text-[#1e1e1e]">
              Depending on your location, you may have rights to access,
              correct, delete, or restrict the processing of your personal data,
              and to object to certain processing. You may also withdraw consent
              where applicable. Contact us at
              <a className="hover:underline ml-1 font-medium text-[#f7931d]" href="mailto:privacy@probeautyapp.net">privacy@probeautyapp.net</a>{" "}
              to exercise these rights.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-[#1e1e1e]">Updating this policy</h2>
            <p className="leading-relaxed mb-0 text-[#1e1e1e]">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated effective date.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
