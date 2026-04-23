import fleet1 from "@/assets/fleet-1.jpg";
import fleetExcavators from "@/assets/fleet-excavators.jpg";
import fleetHowo from "@/assets/fleet-howo.jpg";
import fleetYard from "@/assets/fleet-yard.jpg";

export const projects = [
  {
    id: "p1",
    title: "Crescent Commercial Tower",
    location: "Karachi",
    category: "Commercial",
    status: "completed",
    year: "2023",
    image: "/src/assets/projects/p1.png",
    description: "A 24-story state-of-the-art commercial complex in the heart of Karachi's business district, featuring sustainable energy systems."
  },
  {
    id: "p2",
    title: "Al-Shifa General Hospital",
    location: "Lahore",
    category: "Healthcare",
    status: "completed",
    year: "2022",
    image: "/src/assets/projects/p2.png",
    description: "A 500-bed modern medical facility built to international healthcare standards with advanced MEP integration."
  },
  {
    id: "p3",
    title: "Capital Residency Hub",
    location: "Islamabad",
    category: "Residential",
    status: "in-progress",
    year: "2025",
    image: "/src/assets/projects/p3.png",
    description: "Luxury apartment complex featuring 4 towers, central courtyard, and smart home infrastructure."
  },
  {
    id: "p4",
    title: "Gwadar Logistics Park",
    location: "Gwadar",
    category: "Industrial",
    status: "in-progress",
    year: "2025",
    image: "/src/assets/projects/p4.png",
    description: "Massive warehousing and logistics facility supporting the CPEC initiative with heavy-duty structural engineering."
  },
  {
    id: "p5",
    title: "Peshawar Tech Enclave",
    location: "Peshawar",
    category: "Commercial",
    status: "upcoming",
    year: "2026",
    image: "/src/assets/projects/p5.png",
    description: "A dedicated IT park designed for modern software companies with open-plan layouts and robust power redundancy."
  },
  {
    id: "p6",
    title: "Indus River Bridge",
    location: "Sindh",
    category: "Infrastructure",
    status: "completed",
    year: "2021",
    image: "/src/assets/projects/p6.png",
    description: "A 2km span bridge connecting critical trade routes, built to withstand extreme flooding conditions."
  },
  {
    id: "p7",
    title: "Multan Sports Complex",
    location: "Multan",
    category: "Civil",
    status: "in-progress",
    year: "2024",
    image: "/src/assets/projects/p7.png",
    description: "A 30,000 capacity stadium with advanced roofing structures and extensive surrounding civic works."
  },
  {
    id: "p8",
    title: "Quetta Education City",
    location: "Quetta",
    category: "Educational",
    status: "upcoming",
    year: "2026",
    image: "/src/assets/projects/p8.png",
    description: "A sprawling university campus spanning 50 acres featuring academic blocks, hostels, and research facilities."
  },
  {
    id: "p9",
    title: "Faisalabad Textile Hub",
    location: "Faisalabad",
    category: "Industrial",
    status: "completed",
    year: "2020",
    image: "/src/assets/projects/p9.png",
    description: "A large-scale manufacturing plant with specialized structural requirements for heavy textile machinery."
  },
  {
    id: "p10",
    title: "Workshop & Equipment",
    location: "Pakistan",
    category: "Company",
    status: "completed",
    year: "2024",
    image: fleet1,
    gallery: [fleet1, fleetExcavators, fleetHowo, fleetYard],
    description: "Our fully-owned heavy-equipment fleet and workshop — including HOWO dump trucks and CAT 330D excavators — enabling us to self-perform earthworks, hauling, and site logistics across Pakistan."
  },
  {
    id: "p11",
    title: "Sardar Mohammad Ashraf D. Baluch Office",
    location: "Pakistan",
    category: "Commercial",
    status: "completed",
    year: "2024",
    image: "/src/assets/projects/p1.png",
    description: "Corporate office facility designed and constructed by Zain Manzoor & Co for Sardar Mohammad Ashraf D. Baluch — a turn-key build delivered to the highest finish standards."
  }
];

export const services = [
  {
    id: "s1",
    title: "Construction & Contracting",
    description: "End-to-end building construction for commercial, residential, and industrial projects with uncompromising quality standards.",
    longDescription: "Our Construction & Contracting division is the backbone of Zain Manzoor & Co. We deliver comprehensive building solutions across commercial, residential, and industrial sectors. With a steadfast commitment to uncompromising quality, we manage every phase of construction to ensure structural integrity and timely delivery.",
    capabilities: [
      "Commercial High-Rise Construction",
      "Industrial & Manufacturing Facilities",
      "Residential Complexes & Townhouses",
      "Turnkey Project Execution",
      "Site Logistics & Supply Chain Management",
      "Quality Assurance & Quality Control"
    ],
    process: [
      { step: "01", title: "Site Mobilization", description: "Securing the site, establishing safety protocols, and moving heavy equipment into position." },
      { step: "02", title: "Foundation & Substructure", description: "Excavation, piling, and laying a robust foundation to support the superstructure." },
      { step: "03", title: "Superstructure Erection", description: "Erecting the main framework, from reinforced concrete to steel structuring." },
      { step: "04", title: "Finishing & Handover", description: "Applying premium finishes, final inspections, and formal project handover." }
    ],
    benefits: [
      "Unmatched structural durability",
      "Strict adherence to international safety standards",
      "On-time delivery without cost overruns",
      "Transparent communication throughout the project"
    ],
    icon: "Building2"
  },
  {
    id: "s2",
    title: "Civil Engineering",
    description: "Robust infrastructure development including roads, bridges, and earthworks backed by rigorous engineering principles.",
    longDescription: "Civil Engineering at Zain Manzoor & Co goes beyond basic earthworks. We specialize in robust infrastructure development, crafting roads, bridges, and massive earth-moving projects backed by rigorous engineering principles. Our heavy equipment fleet enables us to self-perform the most challenging civil works across Pakistan.",
    capabilities: [
      "Highway & Road Construction",
      "Bridge & Overpass Engineering",
      "Heavy Earthworks & Excavation",
      "Drainage & Sewerage Systems",
      "Land Grading & Site Preparation",
      "Retaining Walls & Slope Stabilization"
    ],
    process: [
      { step: "01", title: "Survey & Geotech", description: "Comprehensive topographic surveys and geotechnical investigations." },
      { step: "02", title: "Earthworks", description: "Deploying our HOWO dump trucks and CAT excavators for massive soil movement." },
      { step: "03", title: "Infrastructure Layout", description: "Laying base courses, drainage networks, and foundational structures." },
      { step: "04", title: "Paving & Final Works", description: "Final surfacing, load testing, and infrastructure commissioning." }
    ],
    benefits: [
      "Fully-owned fleet ensures rapid mobilization",
      "Engineering precision in challenging terrains",
      "Sustainable and long-lasting infrastructure",
      "Deep expertise in local geology"
    ],
    icon: "HardHat"
  },
  {
    id: "s3",
    title: "Structural Design",
    description: "Advanced structural analysis and design ensuring safety, durability, and cost-efficiency for complex architectural visions.",
    longDescription: "Our Structural Design team translates complex architectural visions into safe, durable, and cost-efficient realities. Utilizing advanced analysis software, we engineer structures capable of withstanding severe seismic and environmental loads while optimizing material usage.",
    capabilities: [
      "High-Rise Structural Analysis",
      "Seismic & Wind Load Engineering",
      "Steel & Concrete Detailing",
      "Foundation Design for Difficult Soils",
      "Value Engineering & Cost Optimization",
      "Structural Retrofitting & Strengthening"
    ],
    process: [
      { step: "01", title: "Conceptual Analysis", description: "Evaluating architectural intent against structural feasibility." },
      { step: "02", title: "Detailed Modeling", description: "Creating 3D models and running stress simulations." },
      { step: "03", title: "Drafting & Detailing", description: "Producing precise construction drawings and bar bending schedules." },
      { step: "04", title: "Site Supervision", description: "Overseeing critical pours and steel fixing to ensure design compliance." }
    ],
    benefits: [
      "Optimized material costs without compromising safety",
      "Resilient designs tailored for seismic zones",
      "Seamless integration with MEP systems",
      "Innovative solutions for complex geometries"
    ],
    icon: "Ruler"
  },
  {
    id: "s4",
    title: "Project Management",
    description: "Comprehensive oversight from inception to handover, ensuring projects are delivered on-time and within budget.",
    longDescription: "Effective Project Management is the linchpin of successful construction. We provide comprehensive oversight from inception to handover, orchestrating multiple stakeholders, managing intricate schedules, and rigorously controlling budgets to ensure flawless execution.",
    capabilities: [
      "Master Scheduling & Sequencing",
      "Budgeting & Cost Control",
      "Subcontractor Coordination",
      "Risk Management & Mitigation",
      "Procurement & Supply Chain Oversight",
      "Regulatory Compliance & Permitting"
    ],
    process: [
      { step: "01", title: "Project Initiation", description: "Defining scope, objectives, and initial budget baselines." },
      { step: "02", title: "Resource Allocation", description: "Assigning teams, finalizing contracts, and procuring materials." },
      { step: "03", title: "Execution Tracking", description: "Daily monitoring of progress against the master schedule." },
      { step: "04", title: "Closeout", description: "Final audits, financial reconciliation, and client handover." }
    ],
    benefits: [
      "Single point of accountability",
      "Proactive risk identification and resolution",
      "Strict adherence to timelines",
      "Transparent reporting and documentation"
    ],
    icon: "ClipboardList"
  },
  {
    id: "s5",
    title: "MEP Services",
    description: "Integrated Mechanical, Electrical, and Plumbing solutions tailored for modern high-performance buildings.",
    longDescription: "Our MEP Services division provides the vital systems that bring buildings to life. We deliver integrated Mechanical, Electrical, and Plumbing solutions tailored for modern, high-performance buildings, focusing on energy efficiency and seamless operation.",
    capabilities: [
      "HVAC System Design & Installation",
      "High & Low Voltage Electrical Networks",
      "Plumbing & Sanitation Systems",
      "Fire Fighting & Alarm Systems",
      "Building Management Systems (BMS)",
      "Energy Efficiency Audits"
    ],
    process: [
      { step: "01", title: "System Engineering", description: "Designing integrated MEP layouts that avoid spatial clashes." },
      { step: "02", title: "First Fix", description: "Installing concealed conduits, pipes, and ductwork." },
      { step: "03", title: "Second Fix", description: "Wiring, connecting fixtures, and installing heavy equipment." },
      { step: "04", title: "Testing & Commissioning", description: "Rigorous system testing, balancing, and operational handover." }
    ],
    benefits: [
      "Optimized energy consumption",
      "Reliable and uninterrupted building operations",
      "Compliance with international safety codes",
      "Future-proofed smart building infrastructure"
    ],
    icon: "Zap"
  },
  {
    id: "s6",
    title: "Interior & Renovation",
    description: "Transforming existing spaces with premium finishes and complete structural overhauls.",
    longDescription: "We breathe new life into existing structures through our Interior & Renovation services. Whether it's a corporate office fit-out or a complete structural overhaul of a heritage building, we combine aesthetic sensibility with engineering rigor to transform spaces.",
    capabilities: [
      "Corporate & Commercial Fit-Outs",
      "Structural Remodeling & Demolition",
      "Premium Finishes & Millwork",
      "Space Planning & Utilization",
      "Acoustic & Lighting Treatments",
      "Adaptive Reuse of Old Structures"
    ],
    process: [
      { step: "01", title: "Space Assessment", description: "Evaluating existing conditions and client requirements." },
      { step: "02", title: "Design & Approvals", description: "Finalizing layouts, material boards, and securing permits." },
      { step: "03", title: "Execution", description: "Careful demolition followed by precision installation of new elements." },
      { step: "04", title: "Final Polish", description: "Detailing, deep cleaning, and final walkthrough." }
    ],
    benefits: [
      "Minimal disruption to ongoing operations",
      "High-end aesthetic finishes",
      "Maximized spatial efficiency",
      "Enhanced property value"
    ],
    icon: "PaintRoller"
  }
];