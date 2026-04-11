import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { COMPANY } from "../data/siteData";
import { useInView } from "../hooks/useInView";

function PageHero() {
  return (
    <section className="relative overflow-hidden gradient-mesh th-bg-page">
      <div className="container-max section-padding !pb-12 text-center">
        <p className="text-sm font-semibold text-copper-500 mb-3">Contact</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold th-heading leading-tight animate-slide-up">
          Contact Us
        </h1>
        <p className="mt-4 text-lg th-muted max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Get in Touch with Our Expert Team
        </p>
      </div>
    </section>
  );
}

function ContactInfo() {
  const [ref, isInView] = useInView();

  const items = [
    { icon: Phone, label: "Phone", value: COMPANY.phone, href: `tel:${COMPANY.phone}` },
    { icon: Mail, label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: MapPin, label: "Location", value: `${COMPANY.address.city}, ${COMPANY.address.country}` },
    { icon: Clock, label: "Business Hours", value: COMPANY.hours },
  ];

  return (
    <div
      ref={ref}
      className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {items.map((item) => (
        <div key={item.label} className="th-bg-inset rounded-2xl p-5 border th-border text-center">
          <div className="w-10 h-10 mx-auto rounded-lg th-bg-primary-soft flex items-center justify-center mb-3">
            <item.icon className="w-5 h-5 text-copper-500" />
          </div>
          <p className="text-xs font-semibold th-faint uppercase tracking-wider mb-1">{item.label}</p>
          {item.href ? (
            <a href={item.href} className="text-sm font-semibold th-heading hover:text-copper-500 transition-colors">
              {item.value}
            </a>
          ) : (
            <p className="text-sm font-semibold th-heading">{item.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend/email service
    alert("Thank you! We will get back to you shortly.");
  };

  return (
    <form onSubmit={handleSubmit} className="th-bg-card rounded-2xl p-6 lg:p-8 border th-border shadow-sm">
      <h3 className="text-xl font-bold th-heading mb-6">Send Us a Message</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold th-body mb-1.5">Your Name *</label>
          <input type="text" name="name" required placeholder="John Doe" className="th-input" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold th-body mb-1.5">Email Address *</label>
          <input type="email" name="email" required placeholder="john@company.com" className="th-input" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold th-body mb-1.5">Phone Number *</label>
          <input type="tel" name="phone" required placeholder="+91-9876543210" className="th-input" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold th-body mb-1.5">Company Name</label>
          <input type="text" name="company" placeholder="Your Company" className="th-input" value={formData.company} onChange={handleChange} />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-semibold th-body mb-1.5">Message *</label>
        <textarea name="message" required rows={5} placeholder="Tell us about your project requirements..." className="th-input resize-none" value={formData.message} onChange={handleChange} />
      </div>
      <button
        type="submit"
        id="contact-form-submit-cta"
        className="btn-accent w-full mt-6 py-3.5"
      >
        Send Message
      </button>
    </form>
  );
}

function VisitSection() {
  const [ref, isInView] = useInView();
  const fullAddress = `${COMPANY.address.line1}, ${COMPANY.address.line2}, ${COMPANY.address.city} - ${COMPANY.address.pin}, ${COMPANY.address.country}`;

  return (
    <section className="section-padding th-bg-alt">
      <div
        ref={ref}
        className={`container-max transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-extrabold th-heading mb-4">Visit Our Facility</h2>
            <div className="space-y-3 text-sm th-body-secondary mb-6">
              <p><span className="font-bold th-heading">Address:</span> {fullAddress}</p>
              <p><span className="font-bold th-heading">GST Number:</span> {COMPANY.gst}</p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              id="contact-open-in-maps-cta"
              className="btn-outline inline-flex items-center gap-2 text-sm"
            >
              Open in Maps <ExternalLink className="w-4 h-4" />
            </a>
            <p className="mt-4 text-xs th-faint">
              Get Directions — We are located in the heart of Delhi&apos;s industrial area with easy access to major highways.
            </p>
          </div>

          <div className="th-bg-card rounded-2xl p-6 border th-border">
            <h4 className="font-bold th-heading mb-3">Why Visit Us?</h4>
            <ul className="space-y-2.5">
              {[
                "Tour our state-of-the-art manufacturing facility",
                "Meet our engineering team in person",
                "See our CNC machines and equipment in action",
                "Discuss your project requirements face-to-face",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm th-body-secondary">
                  <span className="w-1.5 h-1.5 mt-2 rounded-full bg-copper-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero />
      <section className="section-padding th-bg-page">
        <div className="container-max space-y-10">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
      <VisitSection />
    </>
  );
}
