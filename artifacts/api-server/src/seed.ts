/**
 * Seed script – run once to:
 *   1) Push the Drizzle schema to Neon
 *   2) Create the admin user with a bcrypt-hashed password
 *   3) Populate projects and services from the original static data
 *
 * Usage: cd artifacts/api-server && pnpm run seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { db, pool } from "@workspace/db";
import {
  usersTable,
  projectsTable,
  servicesTable,
  siteContentTable,
} from "@workspace/db/schema";

// ──────────────────────────────────────────────────
// Admin credentials  (hash the password, never store plaintext)
// ──────────────────────────────────────────────────
const ADMIN_USERNAME = "zain&mazoor";
const ADMIN_PASSWORD = "zain$%Manzoor12212026";

// ──────────────────────────────────────────────────
// Static seed data (migrated from src/lib/data.ts)
// Images stored as public URL paths
// ──────────────────────────────────────────────────
const projects = [
  {
    id: "p1",
    title: "Project for Lining of Rohri Canal RD 645+670 to RD 680+000",
    location: "Sindh",
    category: "Canal",
    status: "completed",
    year: "2016",
    image: "/assets/projects/p1.png",
    description: "Subcontracting works for the lining of Rohri Canal, one of the largest irrigation canals in the world, ensuring water conservation and structural integrity.",
    employer: "GoS — Irrigation Department",
    contractValue: "PKR 7,059,065,419",
    executedValue: "PKR 2,250,836,125",
    awarded: "13-Jan-2016",
    completed: "06-Nov-2016",
    scope: "Subcontracting works from RD 645+670 to RD 656+670 (11 RDs).",
    gallery: ["/assets/projects/p1.png", "/assets/projects/p2.png", "/assets/projects/p3.png"],
    serviceIds: ["s2", "s3", "s4"],
  },
  {
    id: "p2",
    title: "Al-Shifa General Hospital",
    location: "Lahore",
    category: "Healthcare",
    status: "completed",
    year: "2022",
    image: "/assets/projects/p2.png",
    description: "A 500-bed modern medical facility built to international healthcare standards with advanced MEP integration.",
    employer: "Punjab Health Department",
    contractValue: "PKR 4,120,500,000",
    executedValue: "PKR 4,120,500,000",
    awarded: "10-Feb-2019",
    completed: "15-Dec-2022",
    scope: "Complete civil construction, grey structure, and MEP installation for the main 500-bed hospital building and residential quarters.",
    gallery: ["/assets/projects/p2.png", "/assets/projects/p1.png", "/assets/projects/p3.png"],
    serviceIds: ["s1", "s3", "s4", "s5"],
  },
  {
    id: "p3",
    title: "Capital Residency Hub",
    location: "Islamabad",
    category: "Residential",
    status: "in-progress",
    year: "2025",
    image: "/assets/projects/p3.png",
    description: "Luxury apartment complex featuring 4 towers, central courtyard, and smart home infrastructure.",
    employer: "Capital Development Authority (CDA)",
    contractValue: "PKR 9,840,000,000",
    executedValue: "PKR 3,500,000,000",
    awarded: "22-May-2023",
    completed: "Expected Dec-2025",
    scope: "Structural construction of four 18-story residential towers including basement parking and landscaping.",
    gallery: ["/assets/projects/p3.png", "/assets/projects/p4.png", "/assets/projects/p5.png"],
    serviceIds: ["s1", "s3", "s4", "s5"],
  },
  {
    id: "p4",
    title: "Gwadar Logistics Park",
    location: "Gwadar",
    category: "Industrial",
    status: "in-progress",
    year: "2025",
    image: "/assets/projects/p4.png",
    description: "Massive warehousing and logistics facility supporting the CPEC initiative with heavy-duty structural engineering.",
    employer: "Gwadar Port Authority",
    contractValue: "PKR 12,250,000,000",
    executedValue: "PKR 6,100,000,000",
    awarded: "05-Jan-2023",
    completed: "Expected Jun-2025",
    scope: "Industrial flooring, pre-engineered steel structures for warehouses, and massive earthworks for logistics terminals.",
    gallery: ["/assets/projects/p4.png", "/assets/projects/p6.png", "/assets/projects/p7.png"],
    serviceIds: ["s2", "s3", "s4"],
  },
  {
    id: "p5",
    title: "Peshawar Tech Enclave",
    location: "Peshawar",
    category: "Commercial",
    status: "upcoming",
    year: "2026",
    image: "/assets/projects/p5.png",
    description: "A dedicated IT park designed for modern software companies with open-plan layouts and robust power redundancy.",
    serviceIds: ["s1", "s3", "s5"],
  },
  {
    id: "p6",
    title: "Indus River Bridge",
    location: "Sindh",
    category: "Infrastructure",
    status: "completed",
    year: "2021",
    image: "/assets/projects/p6.png",
    description: "A 2km span bridge connecting critical trade routes, built to withstand extreme flooding conditions.",
    employer: "National Highway Authority (NHA)",
    contractValue: "PKR 15,750,000,000",
    executedValue: "PKR 15,750,000,000",
    awarded: "18-Aug-2017",
    completed: "20-Sep-2021",
    scope: "Foundation piling, concrete pier construction, and superstructure girder placement for a 2km long river bridge.",
    gallery: ["/assets/projects/p6.png", "/assets/projects/p7.png", "/assets/projects/p8.png"],
    serviceIds: ["s2", "s3", "s4"],
  },
  {
    id: "p7",
    title: "Multan Sports Complex",
    location: "Multan",
    category: "Civil",
    status: "in-progress",
    year: "2024",
    image: "/assets/projects/p7.png",
    description: "A 30,000 capacity stadium with advanced roofing structures and extensive surrounding civic works.",
    serviceIds: ["s1", "s2", "s3"],
  },
  {
    id: "p8",
    title: "Quetta Education City",
    location: "Quetta",
    category: "Educational",
    status: "upcoming",
    year: "2026",
    image: "/assets/projects/p8.png",
    description: "A sprawling university campus spanning 50 acres featuring academic blocks, hostels, and research facilities.",
    serviceIds: ["s1", "s3", "s4"],
  },
  {
    id: "p9",
    title: "Faisalabad Textile Hub",
    location: "Faisalabad",
    category: "Industrial",
    status: "completed",
    year: "2020",
    image: "/assets/projects/p9.png",
    description: "A large-scale manufacturing plant with specialized structural requirements for heavy textile machinery.",
    serviceIds: ["s1", "s2"],
  },
  {
    id: "p10",
    title: "Workshop & Equipment",
    location: "Pakistan",
    category: "Company",
    status: "completed",
    year: "2024",
    image: "/assets/fleet-1.jpg",
    gallery: ["/assets/fleet-1.jpg", "/assets/fleet-excavators.jpg", "/assets/fleet-howo.jpg", "/assets/fleet-yard.jpg"],
    description: "Our fully-owned heavy-equipment fleet and workshop — including HOWO dump trucks and CAT 330D excavators — enabling us to self-perform earthworks, hauling, and site logistics across Pakistan.",
    serviceIds: ["s2", "s4"],
  },
  {
    id: "p11",
    title: "Sardar Mohammad Ashraf D. Baluch Office",
    location: "Pakistan",
    category: "Commercial",
    status: "completed",
    year: "2024",
    image: "/assets/projects/p1.png",
    description: "Corporate office facility designed and constructed by Zain Manzoor & Co for Sardar Mohammad Ashraf D. Baluch — a turn-key build delivered to the highest finish standards.",
    serviceIds: ["s1", "s5", "s6"],
  },
];

const services = [
  {
    id: "s1",
    title: "Construction & Contracting",
    description: "End-to-end building construction for commercial, residential, and industrial projects with uncompromising quality standards.",
    longDescription: "Our Construction & Contracting division is the backbone of Zain Manzoor & Co. We deliver comprehensive building solutions across commercial, residential, and industrial sectors. With a steadfast commitment to uncompromising quality, we manage every phase of construction to ensure structural integrity and timely delivery.",
    capabilities: ["Commercial High-Rise Construction", "Industrial & Manufacturing Facilities", "Residential Complexes & Townhouses", "Turnkey Project Execution", "Site Logistics & Supply Chain Management", "Quality Assurance & Quality Control"],
    process: [
      { step: "01", title: "Site Mobilization", description: "Securing the site, establishing safety protocols, and moving heavy equipment into position." },
      { step: "02", title: "Foundation & Substructure", description: "Excavation, piling, and laying a robust foundation to support the superstructure." },
      { step: "03", title: "Superstructure Erection", description: "Erecting the main framework, from reinforced concrete to steel structuring." },
      { step: "04", title: "Finishing & Handover", description: "Applying premium finishes, final inspections, and formal project handover." },
    ],
    benefits: ["Unmatched structural durability", "Strict adherence to international safety standards", "On-time delivery without cost overruns", "Transparent communication throughout the project"],
    icon: "Building2",
  },
  {
    id: "s2",
    title: "Civil Engineering",
    description: "Robust infrastructure development including roads, bridges, and earthworks backed by rigorous engineering principles.",
    longDescription: "Civil Engineering at Zain Manzoor & Co goes beyond basic earthworks. We specialize in robust infrastructure development, crafting roads, bridges, and massive earth-moving projects backed by rigorous engineering principles. Our heavy equipment fleet enables us to self-perform the most challenging civil works across Pakistan.",
    capabilities: ["Highway & Road Construction", "Bridge & Overpass Engineering", "Heavy Earthworks & Excavation", "Drainage & Sewerage Systems", "Land Grading & Site Preparation", "Retaining Walls & Slope Stabilization"],
    process: [
      { step: "01", title: "Survey & Geotech", description: "Comprehensive topographic surveys and geotechnical investigations." },
      { step: "02", title: "Earthworks", description: "Deploying our HOWO dump trucks and CAT excavators for massive soil movement." },
      { step: "03", title: "Infrastructure Layout", description: "Laying base courses, drainage networks, and foundational structures." },
      { step: "04", title: "Paving & Final Works", description: "Final surfacing, load testing, and infrastructure commissioning." },
    ],
    benefits: ["Fully-owned fleet ensures rapid mobilization", "Engineering precision in challenging terrains", "Sustainable and long-lasting infrastructure", "Deep expertise in local geology"],
    icon: "HardHat",
  },
  {
    id: "s3",
    title: "Structural Design",
    description: "Advanced structural analysis and design ensuring safety, durability, and cost-efficiency for complex architectural visions.",
    longDescription: "Our Structural Design team translates complex architectural visions into safe, durable, and cost-efficient realities. Utilizing advanced analysis software, we engineer structures capable of withstanding severe seismic and environmental loads while optimizing material usage.",
    capabilities: ["High-Rise Structural Analysis", "Seismic & Wind Load Engineering", "Steel & Concrete Detailing", "Foundation Design for Difficult Soils", "Value Engineering & Cost Optimization", "Structural Retrofitting & Strengthening"],
    process: [
      { step: "01", title: "Conceptual Analysis", description: "Evaluating architectural intent against structural feasibility." },
      { step: "02", title: "Detailed Modeling", description: "Creating 3D models and running stress simulations." },
      { step: "03", title: "Drafting & Detailing", description: "Producing precise construction drawings and bar bending schedules." },
      { step: "04", title: "Site Supervision", description: "Overseeing critical pours and steel fixing to ensure design compliance." },
    ],
    benefits: ["Optimized material costs without compromising safety", "Resilient designs tailored for seismic zones", "Seamless integration with MEP systems", "Innovative solutions for complex geometries"],
    icon: "Ruler",
  },
  {
    id: "s4",
    title: "Project Management",
    description: "Comprehensive oversight from inception to handover, ensuring projects are delivered on-time and within budget.",
    longDescription: "Effective Project Management is the linchpin of successful construction. We provide comprehensive oversight from inception to handover, orchestrating multiple stakeholders, managing intricate schedules, and rigorously controlling budgets to ensure flawless execution.",
    capabilities: ["Master Scheduling & Sequencing", "Budgeting & Cost Control", "Subcontractor Coordination", "Risk Management & Mitigation", "Procurement & Supply Chain Oversight", "Regulatory Compliance & Permitting"],
    process: [
      { step: "01", title: "Project Initiation", description: "Defining scope, objectives, and initial budget baselines." },
      { step: "02", title: "Resource Allocation", description: "Assigning teams, finalizing contracts, and procuring materials." },
      { step: "03", title: "Execution Tracking", description: "Daily monitoring of progress against the master schedule." },
      { step: "04", title: "Closeout", description: "Final audits, financial reconciliation, and client handover." },
    ],
    benefits: ["Single point of accountability", "Proactive risk identification and resolution", "Strict adherence to timelines", "Transparent reporting and documentation"],
    icon: "ClipboardList",
  },
  {
    id: "s5",
    title: "MEP Services",
    description: "Integrated Mechanical, Electrical, and Plumbing solutions tailored for modern high-performance buildings.",
    longDescription: "Our MEP Services division provides the vital systems that bring buildings to life. We deliver integrated Mechanical, Electrical, and Plumbing solutions tailored for modern, high-performance buildings, focusing on energy efficiency and seamless operation.",
    capabilities: ["HVAC System Design & Installation", "High & Low Voltage Electrical Networks", "Plumbing & Sanitation Systems", "Fire Fighting & Alarm Systems", "Building Management Systems (BMS)", "Energy Efficiency Audits"],
    process: [
      { step: "01", title: "System Engineering", description: "Designing integrated MEP layouts that avoid spatial clashes." },
      { step: "02", title: "First Fix", description: "Installing concealed conduits, pipes, and ductwork." },
      { step: "03", title: "Second Fix", description: "Wiring, connecting fixtures, and installing heavy equipment." },
      { step: "04", title: "Testing & Commissioning", description: "Rigorous system testing, balancing, and operational handover." },
    ],
    benefits: ["Optimized energy consumption", "Reliable and uninterrupted building operations", "Compliance with international safety codes", "Future-proofed smart building infrastructure"],
    icon: "Zap",
  },
  {
    id: "s6",
    title: "Interior & Renovation",
    description: "Transforming existing spaces with premium finishes and complete structural overhauls.",
    longDescription: "We breathe new life into existing structures through our Interior & Renovation services. Whether it's a corporate office fit-out or a complete structural overhaul of a heritage building, we combine aesthetic sensibility with engineering rigor to transform spaces.",
    capabilities: ["Corporate & Commercial Fit-Outs", "Structural Remodeling & Demolition", "Premium Finishes & Millwork", "Space Planning & Utilization", "Acoustic & Lighting Treatments", "Adaptive Reuse of Old Structures"],
    process: [
      { step: "01", title: "Space Assessment", description: "Evaluating existing conditions and client requirements." },
      { step: "02", title: "Design & Approvals", description: "Finalizing layouts, material boards, and securing permits." },
      { step: "03", title: "Execution", description: "Careful demolition followed by precision installation of new elements." },
      { step: "04", title: "Final Polish", description: "Detailing, deep cleaning, and final walkthrough." },
    ],
    benefits: ["Minimal disruption to ongoing operations", "High-end aesthetic finishes", "Maximized spatial efficiency", "Enhanced property value"],
    icon: "PaintRoller",
  },
];

// ──────────────────────────────────────────────────
// Main seed function
// ──────────────────────────────────────────────────
async function main() {
  console.log("🌱  Seeding database…");

  // 1. Admin user
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db
    .insert(usersTable)
    .values({ username: ADMIN_USERNAME, passwordHash: hash })
    .onConflictDoUpdate({
      target: usersTable.username,
      set: { passwordHash: hash },
    });
  console.log(`✅  Admin user '${ADMIN_USERNAME}' upserted`);

  // 2. Projects
  for (const project of projects) {
    await db
      .insert(projectsTable)
      .values(project as any)
      .onConflictDoUpdate({
        target: projectsTable.id,
        set: project as any,
      });
  }
  console.log(`✅  ${projects.length} projects seeded`);

  // 3. Services
  for (const service of services) {
    await db
      .insert(servicesTable)
      .values(service as any)
      .onConflictDoUpdate({
        target: servicesTable.id,
        set: service as any,
      });
  }
  console.log(`✅  ${services.length} services seeded`);

  // 4. Site Content (Default AI Knowledge Base)
  const defaultAIKnowledge = `ZAIN MANZOOR & CO. (ZMCO) CORPORATE KNOWLEDGE BASE & PROFILE

[COMPANY PROFILE]
- Name: Zain Manzoor & Co. Construction and Engineering PVT LTD (ZMCO)
- Tagline: "Building the Future of Pakistan"
- Founder & CEO: Mr. Muneer Ahmed Khoso (founded the firm in 2013)
- Industry Stand: Premier construction, civil engineering, project management, and MEP firm with 12+ years of industry excellence.
- Registered: Fully registered under the Pakistan Engineering Council (PEC).
- Total Projects Delivered: 11 major infrastructure, residential, commercial, and industrial projects across Pakistan.
- Team Strength: Over 100+ highly trained professionals including structural engineers, site managers, architects, QA/QC technicians, and safety coordinators.
- Satisfaction Rating: 100% client satisfaction with zero safety incidents.

[CONTACT DETAILS]
- Corporate Phone: 0315 2185221
- Corporate Email: zmco2025@gmail.com
- Operational Hours: Monday to Saturday, 9:00 AM to 6:00 PM.
- Quotes: Estimates are processed within 24 to 48 hours. Clients can request a quote by emailing details to zmco2025@gmail.com or calling 0315 2185221.

[CORE SERVICES & CAPABILITIES]
1. Construction & Contracting:
   - Capability: High-rise commercial and residential projects, structural framework, brickwork, excavation, site layout, concrete pouring, and custom finishes.
2. Civil Engineering:
   - Capability: Roads, highways, canal lining (including Rohri Canal), bridge structures, storm-water drainage, and comprehensive earthworks.
3. Structural Design:
   - Capability: Computer-aided structural drafting, load-bearing assessments, high-wind load engineering, seismic analysis, and compliance codes.
4. Project Management:
   - Capability: Integrated scheduling, cost budgeting, materials tracking, subcontractor coordination, and strict quality assurance checks.
5. MEP Services:
   - Capability: High-voltage electrical grids, central HVAC system installation, smart-building controls (BMS), industrial firefighting plumbing, and sanitation networks.
6. Interior & Renovation:
   - Capability: Adaptive reuse of old structures, hospital and clinic grade fit-outs, hotel millwork, spatial planning, and high-end acoustic treatments.

[LANDMARK PROJECTS]
1. Rohri Canal Lining:
   - Location: Sindh, Pakistan
   - Scope: Large-scale concrete canal lining extending several kilometers to improve irrigation efficiency and stop water logging/seepage.
2. Indus River Bridge:
   - Location: Sindh, Pakistan
   - Scope: Heavy-civil bridge infrastructure crossing the Indus River, facilitating high-capacity regional logistics.
3. Al-Shifa General Hospital:
   - Location: Lahore, Pakistan
   - Scope: Multi-floor specialty healthcare facility construction including advanced HVAC isolation zones, sterile rooms, and electrical backups.
4. Capital Residency Hub:
   - Location: Islamabad, Pakistan
   - Scope: A premium multi-story luxury residential apartment high-rise equipped with parking basements and a panoramic sky lounge.
5. Gwadar Logistics Park:
   - Location: Gwadar, Balochistan
   - Scope: Strategic warehousing facilities and deep-foundation industrial bays supporting trade logistics along the CPEC route.
6. Faisalabad Industrial Estate:
   - Location: Faisalabad, Punjab
   - Scope: Turnkey construction of manufacturing plants, factory bays, access roads, and high-capacity stormwater networks.
7. High-End Commercial Plaza:
   - Location: Karachi, Sindh
   - Scope: A 12-story commercial corporate tower featuring energy-efficient glass facade framing, central cooling, and open-plan workspaces.
8. DHA Residential Mansions:
   - Location: Lahore, Punjab
   - Scope: Bespoke luxury residential mansions featuring custom marble finishes, smart-home automation, and high-performance architectural design.
9. Multan Highway Bypass:
   - Location: Multan, Punjab
   - Scope: A dual-lane highway bypass facilitating bypass traffic flow and reducing congestion within downtown Multan.

[HEAVY EQUIPMENT FLEET]
- CAT 330D Excavators (2 units)
- HOWO Heavy-Duty Dump Trucks (4 units)
- Dynapac Road Rollers & Soil Compactors (2 units)
- Sany Mobile Concrete Batching Plants (1 unit)
- Zoomlion High-Altitude Tower Cranes (1 unit)
- Leica Geosystems High-Precision Surveying & GPS Systems (3 units)

[CORPORATE SAFETY & COMPLIANCE]
- ZMCO Shield: A zero-incident safety framework enforcing 100% PPE compliance (hard hats, high-vis vests, steel-toe boots), regular safety audits, and mandatory daily toolbox talks.
- Certifications: ISO 9001:2015 (Quality Management System) and ISO 45001:2018 (Occupational Health & Safety).`;

  await db
    .insert(siteContentTable)
    .values({ key: "aiKnowledgeBase", value: defaultAIKnowledge })
    .onConflictDoUpdate({
      target: siteContentTable.key,
      set: { value: defaultAIKnowledge, updatedAt: new Date() },
    });
  console.log("✅  Default AI Knowledge Base seeded");

  console.log("🎉  Seeding complete!");
  await pool.end();
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
