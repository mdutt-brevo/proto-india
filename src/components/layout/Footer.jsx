import { Link } from "react-router-dom";
import { COMPANY, FOOTER_LINKS } from "../../data/siteData";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-iron-950/80 backdrop-blur-sm text-white/80 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 blueprint-grid-dark opacity-40" />

      <div className="container-max section-padding !py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-copper-400 to-copper-600 flex items-center justify-center">
                <span className="text-white font-heading font-extrabold text-sm">
                  {COMPANY.shortName}
                </span>
              </div>
              <div className="leading-none">
                <span className="font-heading font-extrabold text-lg text-white">
                  {COMPANY.name.split(" ")[0].toUpperCase()}
                </span>
                <span className="block text-[10px] font-semibold text-copper-400 tracking-[0.2em] uppercase">
                  {COMPANY.name.split(" ")[1]}
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              Specializing in precision injection mould design, manufacturing,
              and CNC machining services.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded text-xs font-mono text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-copper-400" />
              ISO 9001:2015 CERTIFIED
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([key, links]) => (
            <div key={key}>
              <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
                {key}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-white/50">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-white/40" />
                <span>
                  {COMPANY.address.line1}, {COMPANY.address.line2},{" "}
                  {COMPANY.address.city} - {COMPANY.address.pin},{" "}
                  {COMPANY.address.country}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-white/40" />
                <a href={`tel:${COMPANY.phone}`} className="hover:text-white transition-colors">
                  {COMPANY.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-white/40" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">
                  {COMPANY.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0 text-white/40" />
                <span>{COMPANY.hours}</span>
              </div>
              <p className="text-xs text-white/30 pt-1 font-mono">
                GST: {COMPANY.gst}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 relative riveted-edge">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights
            reserved.
          </span>
          <div className="flex gap-4">
            {COMPANY.certifications.map((cert) => (
              <span
                key={cert}
                className="px-2 py-1 rounded bg-white/5 text-white/50 font-medium font-mono"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
