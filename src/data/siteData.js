// ============================================================
// Sharma Tools — single source of truth for all site content
// ============================================================

export const COMPANY = {
  name: "Sharma Tools",
  shortName: "ST",
  tagline: "Precision Tooling Solutions",
  phone: "+91-9876543210",
  email: "info@sharmatools.com",
  gst: "07XXXXX1234X1ZX",
  address: {
    line1: "Plot No. 123, Sector 24",
    line2: "Industrial Area",
    city: "Delhi",
    pin: "110020",
    country: "India",
  },
  hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  certifications: ["ISO 9001:2015"],
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Industries", href: "/industries" },
  { label: "Contact", href: "/contact" },
];

export const STATS = [
  { value: "15+", label: "Years of Experience" },
  { value: "200+", label: "Satisfied Clients" },
  { value: "500+", label: "Projects Completed" },
  { value: "98%", label: "On-Time Delivery" },
];

export const WHY_CHOOSE_US = [
  {
    title: "Superior Quality",
    description:
      "ISO certified manufacturing processes ensuring precision and consistency in every project",
    icon: "ShieldCheck",
  },
  {
    title: "On-Time Delivery",
    description:
      "98% on-time delivery rate with efficient project management and production planning",
    icon: "Clock",
  },
  {
    title: "Expert Team",
    description:
      "15+ years of industry experience with skilled engineers and technicians",
    icon: "Users",
  },
];

export const SERVICES = [
  {
    id: "injection-mould-design",
    title: "Injection Mould Design",
    shortDesc:
      "Expert CAD/CAM design services using latest software for optimal part quality and production efficiency.",
    features: [
      "3D mould flow analysis",
      "Design optimization",
      "Prototype development",
      "Technical consultation",
    ],
    capabilities: "SolidWorks, Creo, CATIA, AutoCAD",
    icon: "PenTool",
    color: "from-copper-500 to-copper-700",
    image: "/assets/services/injection-mould-design.webp",
  },
  {
    id: "injection-mould-manufacturing",
    title: "Injection Mould Manufacturing",
    shortDesc:
      "Precision manufacturing of high-quality injection moulds for diverse applications and industries.",
    features: [
      "Multi-cavity moulds",
      "Hot runner systems",
      "Complex geometries",
      "Quality assurance",
    ],
    capabilities: "Up to 500 ton mould capacity",
    icon: "Layers",
    color: "from-slate-500 to-slate-700",
    image: "/assets/services/injection-mould-manufacturing.webp",
  },
  {
    id: "cnc-machining",
    title: "CNC Machining",
    shortDesc:
      "Advanced CNC machining services including EDM, milling, and turning for precision components.",
    features: [
      "High precision (+/- 0.01mm)",
      "3-axis & 5-axis machining",
      "Wire EDM",
      "Surface grinding",
    ],
    capabilities: "Steel, aluminum, copper, exotic alloys",
    icon: "Cog",
    color: "from-copper-600 to-copper-800",
    image: "/assets/services/cnc-machining.webp",
  },
  {
    id: "mould-repair",
    title: "Mould Repair & Maintenance",
    shortDesc:
      "Expert repair and preventive maintenance services to extend mould life and minimize downtime.",
    features: [
      "Quick turnaround",
      "Cavity restoration",
      "Chrome plating",
      "On-site support",
    ],
    capabilities: "All mould types and sizes",
    icon: "Wrench",
    color: "from-iron-500 to-iron-700",
    image: "/assets/services/mould-repair.webp",
  },
  {
    id: "injection-molding-production",
    title: "Injection Molding Production",
    shortDesc:
      "Complete injection molding production services from prototypes to mass production runs.",
    features: [
      "50T to 500T machines",
      "Quality inspection",
      "Assembly services",
      "Packaging solutions",
    ],
    capabilities: "Thermoplastics & engineering plastics",
    icon: "Factory",
    color: "from-slate-600 to-iron-700",
    image: "/assets/services/injection-molding-production.webp",
  },
  {
    id: "product-development",
    title: "Product Development",
    shortDesc:
      "End-to-end product development support from concept to production-ready tooling.",
    features: [
      "DFM analysis",
      "Material selection",
      "Cost optimization",
      "Prototyping",
    ],
    capabilities: "Full project management",
    icon: "Lightbulb",
    color: "from-copper-400 to-copper-600",
    image: "/assets/services/product-development.webp",
  },
];

export const PROCESS_STEPS = [
  {
    step: 1,
    title: "Consultation",
    description: "Understanding your requirements and specifications",
    icon: "MessageSquare",
  },
  {
    step: 2,
    title: "Design",
    description: "CAD/CAM design and DFM analysis",
    icon: "PenTool",
  },
  {
    step: 3,
    title: "Manufacturing",
    description: "Precision machining and assembly",
    icon: "Cog",
  },
  {
    step: 4,
    title: "Testing",
    description: "Quality inspection and trial runs",
    icon: "ClipboardCheck",
  },
  {
    step: 5,
    title: "Delivery",
    description: "On-time delivery with documentation",
    icon: "Truck",
  },
];

export const INDUSTRIES = [
  {
    id: "consumer-electronics",
    title: "Consumer Electronics",
    description:
      "Precision moulds for electronic housings, connectors, and components",
    icon: "Smartphone",
    image: "/assets/industries/consumer-electronics.webp",
  },
  {
    id: "automotive",
    title: "Automotive",
    description:
      "High-quality tooling for interior trim, under-hood components, and assemblies",
    icon: "Car",
    image: "/assets/industries/automotive.webp",
  },
  {
    id: "electrical",
    title: "Electrical Fittings",
    description:
      "Moulds for switches, sockets, junction boxes, and electrical enclosures",
    icon: "Zap",
    image: "/assets/industries/electrical.webp",
  },
  {
    id: "appliances",
    title: "Home Appliances",
    description:
      "Precision tooling for kitchen appliances, white goods, and consumer products",
    icon: "Refrigerator",
    image: "/assets/industries/appliances.webp",
  },
  {
    id: "packaging",
    title: "Packaging",
    description:
      "Custom moulds for bottles, containers, caps, and packaging solutions",
    icon: "Package",
    image: "/assets/industries/packaging.webp",
  },
  {
    id: "medical",
    title: "Medical Devices",
    description:
      "Clean-room compatible moulds for medical components and devices",
    icon: "Heart",
    image: "/assets/industries/medical.webp",
  },
];

export const INDUSTRY_STRENGTHS = [
  {
    title: "Industry-Specific Expertise",
    description:
      "Deep understanding of material requirements, tolerances, and production volumes specific to each industry sector",
    icon: "Award",
  },
  {
    title: "Compliance & Standards",
    description:
      "Adherence to industry standards including ISO, automotive PPAP, and medical device regulations",
    icon: "ShieldCheck",
  },
  {
    title: "Scalable Solutions",
    description:
      "From prototype to mass production, we scale our capabilities to match your production requirements",
    icon: "TrendingUp",
  },
  {
    title: "Technical Support",
    description:
      "Ongoing engineering support for design optimization, troubleshooting, and continuous improvement",
    icon: "Headphones",
  },
];

export const TESTIMONIALS = [
  {
    text: "Sharma Tools delivered exceptional quality moulds within the promised timeline. Their attention to detail and technical expertise is outstanding.",
    author: "Rajesh Kumar",
    role: "Production Manager",
    company: "TechnoPlast Industries",
  },
  {
    text: "We have been working with Sharma Tools for over 3 years. Their CNC machining precision and after-sales service is unmatched in the industry.",
    author: "Priya Sharma",
    role: "CEO",
    company: "ElectroFit Components",
  },
  {
    text: "From design to production, Sharma Tools team guided us through every step. The moulds have been running flawlessly for over 2 years now.",
    author: "Amit Patel",
    role: "Engineering Head",
    company: "AutoParts Manufacturing Ltd.",
  },
];

export const GALLERY_ITEMS = [
  { title: "CNC Machining Operation", category: "cnc", image: "/assets/gallery/cnc-machining-operation.webp" },
  { title: "Precision Mould Manufacturing", category: "mould", image: "/assets/gallery/precision-mould-manufacturing.webp" },
  { title: "CNC Lathe Work", category: "cnc", image: "/assets/gallery/cnc-lathe-work.webp" },
  { title: "Industrial Tooling", category: "mould", image: "/assets/gallery/industrial-tooling.webp" },
  { title: "Precision Manufacturing", category: "cnc", image: "/assets/gallery/precision-manufacturing.webp" },
  { title: "Welding Expertise", category: "manufacturing", image: "/assets/gallery/welding-expertise.webp" },
  { title: "Manufacturing Process", category: "manufacturing", image: "/assets/gallery/manufacturing-process.webp" },
  { title: "Precision Gears", category: "manufacturing", image: "/assets/gallery/precision-gears.webp" },
];

export const FEATURED_PROJECTS = [
  {
    title: "Automotive Interior Trim Mould",
    description:
      "Complex 4-cavity mould for automotive interior trim components. Features include hot runner system, hydraulic core pulls, and precision surface finish requirements.",
    specs: {
      Industry: "Automotive",
      Material: "P20 Steel with nitriding",
      Cavities: "4",
      "Cycle Time": "45 seconds",
      Delivery: "8 weeks",
    },
    image: "/assets/featured/automotive-trim-mould.webp",
  },
  {
    title: "Electronic Enclosure Mould",
    description:
      "High-precision 2-cavity mould for consumer electronics housing with tight tolerance requirements and complex geometry.",
    specs: {
      Industry: "Consumer Electronics",
      Material: "H13 Steel with chrome plating",
      Cavities: "2",
      Tolerance: "\u00b10.05mm",
      Delivery: "6 weeks",
    },
    image: "/assets/featured/electronic-enclosure-mould.webp",
  },
];

export const ABOUT_STORY = {
  paragraphs: [
    "Founded over 15 years ago in the heart of Delhi's industrial area, Sharma Tools has grown from a small workshop to one of India's most trusted names in precision injection mould manufacturing and CNC machining.",
    "Our journey began with a simple mission: to provide OEMs and MSMEs with world-class tooling solutions that match international standards while remaining accessible and affordable. Today, we serve over 200 satisfied clients across diverse industries.",
    "Through continuous investment in technology, training, and quality systems, we have built a reputation for excellence in design, manufacturing, and after-sales support.",
  ],
  mission:
    "To deliver precision-engineered tooling solutions with unwavering commitment to quality, reliability, and continuous improvement. We aim to be a partner in our clients' success by providing innovative, cost-effective solutions backed by exceptional technical support.",
  vision:
    "To be recognized as India's most trusted tooling partner, setting industry benchmarks for quality, innovation, and customer satisfaction. We envision expanding our capabilities while maintaining the personal touch and technical excellence that define Sharma Tools.",
};

export const CORE_VALUES = [
  { title: "Quality First", description: "Uncompromising standards in every project", icon: "Award" },
  { title: "Reliability", description: "Consistent delivery on time, every time", icon: "Clock" },
  { title: "Innovation", description: "Continuous improvement and technology adoption", icon: "Lightbulb" },
  { title: "Integrity", description: "Transparent, honest business relationships", icon: "Shield" },
];

export const TIMELINE = [
  { year: "2008", title: "Foundation", description: "Started operations with a small team and 2 CNC machines in Delhi" },
  { year: "2012", title: "Expansion", description: "Expanded facility and added EDM capabilities, serving 50+ clients" },
  { year: "2016", title: "ISO Certification", description: "Achieved ISO 9001:2015 certification for quality management" },
  { year: "2020", title: "Technology Upgrade", description: "Invested in 5-axis CNC machines and advanced CAD/CAM systems" },
  { year: "2024", title: "Present Day", description: "Serving 200+ clients with 500+ successful projects completed" },
];

export const SUCCESS_STORIES = [
  {
    title: "Automotive Component",
    description: "Delivered multi-cavity mould for automotive interior trim with 99.8% quality acceptance rate",
    industry: "Automotive",
  },
  {
    title: "Electronics Housing",
    description: "Precision moulds for consumer electronics with tight tolerances and complex geometries",
    industry: "Electronics",
  },
  {
    title: "Medical Device Component",
    description: "Clean-room compatible moulds meeting stringent medical device manufacturing standards",
    industry: "Medical",
  },
];

export const FOOTER_LINKS = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Industries", href: "/industries" },
    { label: "Contact", href: "/contact" },
  ],
  "Our Services": [
    { label: "Injection Mould Design", href: "/services" },
    { label: "Mould Manufacturing", href: "/services" },
    { label: "CNC Machining", href: "/services" },
    { label: "Mould Repair", href: "/services" },
    { label: "Injection Molding", href: "/services" },
  ],
};
