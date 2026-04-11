import { useState } from "react";
import { Upload, Phone, Check } from "lucide-react";
import { COMPANY } from "../data/siteData";
import { useInView } from "../hooks/useInView";

function PageHero() {
  return (
    <section className="relative overflow-hidden gradient-mesh th-bg-page">
      <div className="container-max section-padding !pb-12 text-center">
        <p className="text-sm font-semibold text-copper-500 mb-3">Quote</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold th-heading leading-tight animate-slide-up">
          Request a Quote
        </h1>
        <p className="mt-4 text-lg th-muted max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Get a Competitive Quote for Your Tooling Project
        </p>
      </div>
    </section>
  );
}

function QuoteForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "",
    serviceType: "", material: "", quantity: "",
    timeline: "", description: "",
  });
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend
    alert("Thank you! Our team will review your requirements and respond within 24 hours.");
  };

  return (
    <form onSubmit={handleSubmit} className="th-bg-card rounded-2xl p-6 lg:p-8 border th-border shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold th-heading">Project Details</h3>
        <p className="text-sm th-subtle mt-1">
          Fill out the form below and our team will get back to you within 24 hours
        </p>
      </div>

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
          <label className="block text-sm font-semibold th-body mb-1.5">Company Name *</label>
          <input type="text" name="company" required placeholder="Your Company" className="th-input" value={formData.company} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold th-body mb-1.5">Service Type *</label>
          <select name="serviceType" required className="th-select" value={formData.serviceType} onChange={handleChange}>
            <option value="">Select service</option>
            <option value="mould-design">Injection Mould Design</option>
            <option value="mould-manufacturing">Mould Manufacturing</option>
            <option value="cnc-machining">CNC Machining</option>
            <option value="mould-repair">Mould Repair & Maintenance</option>
            <option value="injection-molding">Injection Molding Production</option>
            <option value="product-development">Product Development</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold th-body mb-1.5">Material</label>
          <input type="text" name="material" placeholder="e.g., ABS, PP, PC, Steel grade" className="th-input" value={formData.material} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold th-body mb-1.5">Quantity Required</label>
          <input type="text" name="quantity" placeholder="e.g., 10,000 parts/month" className="th-input" value={formData.quantity} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-semibold th-body mb-1.5">Project Timeline *</label>
          <select name="timeline" required className="th-select" value={formData.timeline} onChange={handleChange}>
            <option value="">Select timeline</option>
            <option value="urgent">Urgent (1-2 weeks)</option>
            <option value="standard">Standard (3-6 weeks)</option>
            <option value="flexible">Flexible (6+ weeks)</option>
            <option value="planning">Just Planning</option>
          </select>
        </div>
      </div>

      {/* File Upload */}
      <div className="mt-4">
        <label className="block text-sm font-semibold th-body mb-1.5">
          Upload CAD Drawing (STEP, IGS, PDF)
        </label>
        <label className="flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed th-border-input hover:border-copper-400 th-bg-inset cursor-pointer transition-colors">
          <Upload className="w-6 h-6 th-ghost mb-1" />
          <span className="text-sm th-subtle">
            {fileName || "Click to upload or drag and drop"}
          </span>
          <span className="text-xs th-ghost mt-0.5">STEP, IGS, PDF (Max 50MB)</span>
          <input type="file" className="hidden" accept=".step,.stp,.igs,.iges,.pdf" onChange={handleFileChange} />
        </label>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm font-semibold th-body mb-1.5">Project Description *</label>
        <textarea name="description" required rows={4} placeholder="Please describe your project requirements, special features, tolerances, etc." className="th-input resize-none" value={formData.description} onChange={handleChange} />
      </div>

      <button type="submit" id="quote-form-submit-cta" className="btn-accent w-full mt-6 py-3.5">
        Submit Quote Request
      </button>
    </form>
  );
}

function WhatsNext() {
  const [ref, isInView] = useInView();

  const steps = [
    { num: 1, title: "Quick Review", desc: "Our team reviews your requirements within 24 hours" },
    { num: 2, title: "Technical Analysis", desc: "We perform feasibility and DFM analysis" },
    { num: 3, title: "Detailed Quote", desc: "Receive a comprehensive quote with timeline" },
  ];

  return (
    <div
      ref={ref}
      className={`th-bg-inset rounded-2xl p-6 lg:p-8 border th-border transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <h3 className="text-lg font-bold th-heading mb-6">What Happens Next?</h3>
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-copper-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-copper-500/20">
              {step.num}
            </div>
            <div>
              <h4 className="font-bold th-heading text-sm">{step.title}</h4>
              <p className="text-xs th-subtle mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Us compact */}
      <div className="mt-8 pt-6 border-t th-border-subtle">
        <h4 className="text-sm font-bold th-heading mb-3">Why Choose Us?</h4>
        <ul className="space-y-2">
          {[
            "Competitive pricing",
            "98% on-time delivery",
            "ISO certified quality",
            "15+ years experience",
            "Technical support included",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm th-body-secondary">
              <Check className="w-4 h-4 text-copper-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Help callout */}
      <div className="mt-6 p-4 rounded-lg th-bg-primary-soft border border-copper-100 dark:border-copper-800/50">
        <p className="text-sm font-semibold text-copper-700 dark:text-copper-300 mb-1">Need Help?</p>
        <p className="text-xs text-copper-600/70 dark:text-copper-400/70">
          Our technical team is available to answer your questions
        </p>
        <a
          href={`tel:${COMPANY.phone}`}
          className="inline-flex items-center gap-2 mt-2 text-sm font-bold text-copper-600 dark:text-copper-400 hover:text-copper-700 dark:hover:text-copper-300 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call {COMPANY.phone}
        </a>
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <>
      <PageHero />
      <section className="section-padding th-bg-page">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <QuoteForm />
            </div>
            <div>
              <WhatsNext />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
