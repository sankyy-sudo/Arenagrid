import {
  Award,
  Building2,
  CheckCircle2,
  Factory,
  GraduationCap,
  Hammer,
  Handshake,
  HardHat,
  Leaf,
  Lightbulb,
  School,
  ShieldCheck,
  Trophy,
  Users,
  Wrench
} from "lucide-react";
import type { ComponentType } from "react";

export type IconComponent = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

export const sports = [
  {
    name: "Football & Futsal",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
    copy: "High-performance turf, drainage, fencing and lighting systems for competitive play."
  },
  {
    name: "Basketball",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
    copy: "Outdoor and indoor court systems designed for grip, bounce and all-weather use."
  },
  {
    name: "Badminton",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80",
    copy: "Indoor flooring, line marking and lighting coordination for institutional facilities."
  },
  {
    name: "Tennis",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80",
    copy: "Court builds and resurfacing for academies, clubs and premium communities."
  },
  {
    name: "Hockey",
    image: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=900&q=80",
    copy: "Purpose-built synthetic systems with attention to base, drainage and playability."
  },
  {
    name: "Padel",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=80",
    copy: "Compact premium court infrastructure for clubs, hospitality and real estate."
  },
  {
    name: "Pickleball",
    image: "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?auto=format&fit=crop&w=900&q=80",
    copy: "Fast-turnaround court layouts for active communities and sports destinations."
  },
  {
    name: "Volleyball",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80",
    copy: "Durable floor and court systems for campus, club and multipurpose spaces."
  },
  {
    name: "Squash",
    image: "https://images.unsplash.com/photo-1570743510225-58b4476ea743?auto=format&fit=crop&w=900&q=80",
    copy: "Compact indoor planning with premium finishes and technical coordination."
  },
  {
    name: "Athletics / Running Tracks",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    copy: "Track surfaces and base systems for schools, universities and stadium projects."
  },
  {
    name: "Indoor Sports",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    copy: "Multi-use halls with flooring, markings, fixtures and maintenance planning."
  },
  {
    name: "Multi-Sport",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80",
    copy: "Integrated spaces that support several sports without compromising daily operations."
  },
  {
    name: "Children's Play Areas",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80",
    copy: "Safe, colorful and resilient active play zones for early learning environments."
  }
];

export const products = [
  {
    name: "Synthetic Sports Turf",
    category: "Artificial Turf",
    image: "https://images.unsplash.com/photo-1570498839593-e565b39455fc?auto=format&fit=crop&w=900&q=80",
    copy: "Engineered turf systems for football, futsal, hockey, multi-sport and landscape applications."
  },
  {
    name: "Acrylic Court Systems",
    category: "Court Surfaces",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=80",
    copy: "Layered court surfaces with controlled speed, grip and color specification."
  },
  {
    name: "Indoor Sports Flooring",
    category: "Vinyl / Wooden / PU",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=900&q=80",
    copy: "Resilient indoor systems for schools, academies, clubs and training centers."
  },
  {
    name: "Running Track Surfaces",
    category: "Athletics",
    image: "https://images.unsplash.com/photo-1530137073520-7d4c0d88df06?auto=format&fit=crop&w=900&q=80",
    copy: "Track systems for training, institutional sport and competition-focused facilities."
  }
];

export const services = [
  { name: "Consultation", icon: Lightbulb, copy: "Feasibility, site review, sport mix, budgeting and project roadmap." },
  { name: "Design", icon: Building2, copy: "Layouts, line markings, access planning, drainage, lighting and specification." },
  { name: "Construction", icon: HardHat, copy: "Civil base, sub-surface coordination, fencing, lighting and project management." },
  { name: "Installation", icon: Hammer, copy: "Surface installation, finishing, fixtures, safety checks and handover." },
  { name: "Maintenance", icon: Wrench, copy: "Lifecycle care, cleaning, repairs and long-term surface performance plans." }
];

export const industries = [
  { name: "Schools", icon: School, copy: "Safe daily-use sports facilities for growing campuses." },
  { name: "Colleges & Universities", icon: GraduationCap, copy: "Competition-ready infrastructure for large institutional footprints." },
  { name: "Sports Academies", icon: Trophy, copy: "Performance-led training environments built around sport outcomes." },
  { name: "Sports Clubs", icon: Users, copy: "Premium member facilities with durable operating models." },
  { name: "Real Estate", icon: Building2, copy: "Amenity sports spaces for townships and residential communities." },
  { name: "Corporate Campuses", icon: Factory, copy: "Active workplace infrastructure for wellness and engagement." },
  { name: "Government", icon: ShieldCheck, copy: "Public sports assets built for scale, access and resilience." },
  { name: "Hotels & Hospitality", icon: Handshake, copy: "Guest-facing courts and leisure sports destinations." }
];

export const projects = [
  {
    title: "Northline International School",
    location: "Gurugram, Haryana",
    sport: "Football / Basketball / Athletics",
    type: "Campus Sports Masterplan",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Cedar Sports Academy",
    location: "Pune, Maharashtra",
    sport: "Tennis / Padel / Pickleball",
    type: "Academy Expansion",
    status: "In Handover",
    image: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Verdant Heights Community",
    location: "Bengaluru, Karnataka",
    sport: "Multi-Sport / Play Area",
    type: "Residential Amenity",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80"
  }
];

export const capabilityCards = [
  { title: "Premium Quality", icon: Award, copy: "Specified systems, disciplined installation and clear handover standards." },
  { title: "Trusted Commitment", icon: CheckCircle2, copy: "Practical project planning with dependable communication from start to finish." },
  { title: "Sustainable Solutions", icon: Leaf, copy: "Drainage, surface lifecycle and material choices planned with long-term use in mind." },
  { title: "Expert Execution", icon: HardHat, copy: "Technical teams aligned across design, civil works, installation and maintenance." }
];

export const testimonials = [
  {
    quote:
      "Arena Grid Infra helped us turn a complicated campus requirement into a clean, durable and beautiful sports zone.",
    name: "Anika Mehra",
    role: "Director, Northline International School"
  },
  {
    quote:
      "Their team understood the operational side of our academy, not just the surface installation. That made the project smoother.",
    name: "Raghav Menon",
    role: "Founder, Cedar Sports Academy"
  }
];
