/**
 * One-time content seed — mirrors the portfolio's current static JSON data
 * exactly, so switching the frontend to the API is a zero-regression swap.
 * Safe to re-run: every model is skipped if it already has data, so it
 * never overwrites real edits made from the admin dashboard.
 *
 * Pass --force to overwrite existing sections anyway — e.g. to reset back
 * to starter content, or to repair a section that only has bare schema
 * defaults (no admin has actually edited it) rather than real content.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";

const FORCE = process.argv.includes("--force");

import { Profile } from "../src/models/Profile.js";
import { StatsSection } from "../src/models/StatsSection.js";
import { CompaniesSection } from "../src/models/CompaniesSection.js";
import { Company } from "../src/models/Company.js";
import { TechStackSection } from "../src/models/TechStackSection.js";
import { ExperienceSection } from "../src/models/ExperienceSection.js";
import { Experience } from "../src/models/Experience.js";
import { ProjectsSection } from "../src/models/ProjectsSection.js";
import { Project } from "../src/models/Project.js";
import { SkillsSection } from "../src/models/SkillsSection.js";
import { ProcessSection } from "../src/models/ProcessSection.js";
import { Resume } from "../src/models/Resume.js";
import { ContactSection } from "../src/models/ContactSection.js";
import { SocialLinks } from "../src/models/SocialLinks.js";
import { FooterSection } from "../src/models/FooterSection.js";

async function seedSingleton(Model, label, data) {
  const existing = await Model.findOne();
  if (existing && !FORCE) {
    console.log(`[seed:content] ${label} already present, skipping`);
    return;
  }
  if (existing) {
    existing.set(data);
    await existing.save();
    console.log(`[seed:content] ${label} overwritten (--force)`);
    return;
  }
  await Model.create(data);
  console.log(`[seed:content] ${label} seeded`);
}

async function seedCollection(Model, label, docs) {
  const count = await Model.countDocuments();
  if (count > 0 && !FORCE) {
    console.log(`[seed:content] ${label} already has ${count} doc(s), skipping`);
    return;
  }
  if (count > 0) {
    await Model.deleteMany({});
    console.log(`[seed:content] ${label} cleared ${count} doc(s) (--force)`);
  }
  await Model.insertMany(docs);
  console.log(`[seed:content] ${label} seeded (${docs.length})`);
}

async function run() {
  await connectDB(process.env.MONGO_URI);

  await seedSingleton(Profile, "profile", {
    name: "Subhojit Das",
    firstName: "Subhojit",
    role: "Senior React Native Developer",
    title: "React Native Specialist & Mobile Systems Engineer",
    availabilityPill: "AVAILABLE FOR REACT NATIVE & MOBILE ROLES",
    availabilityBadge: "AVAILABLE FOR SENIOR MOBILE ROLES",
    headline: ["Building Zero-Jank &", "Ultra-Fluid Mobile Apps."],
    intro:
      "Senior React Native developer with 6+ years engineering high-throughput GPS dispatch engines, C++ TurboModules, and resilient offline-first mobile infrastructures across iOS & Android.",
    primaryCta: { label: "Explore Featured Projects", href: "#projects" },
    secondaryCta: { label: "Download CV (PDF)", href: "/Subhojit_Das_Resume.pdf" },
    avatar: { url: "/images/profile.svg", publicId: null, alt: "Subhojit Das, Senior React Native Developer" },
    card: {
      statusTag: "LIVE // NODE_ACTIVE",
      envTag: "UTC+5:30 REMOTE · FABRIC 0.74",
      nameTag: "Subhojit Das",
      roleTag: "React Native Engineer",
      engineTag: "HERMES JSI ENGINE",
      metrics: [
        { label: "FPS", value: "59.9" },
        { label: "JANK", value: "0" },
        { label: "HEAP", value: "38.2 MB" },
      ],
    },
    specTiles: [
      { label: "RENDER PIPELINE", value: "Fabric C++", meta: "DIRECT JSI CALL" },
      { label: "FRAME BUDGET", value: "16.6ms Target", meta: "ZERO DROP FRAMES" },
      { label: "BRIDGE MODEL", value: "TurboModules", meta: "SYNCHRONOUS" },
    ],
    heroPills: ["React Native 0.74", "TypeScript 5.x", "Reanimated 3", "Mapbox GL", "WatermelonDB"],
    specializations: [
      "Fabric 0.74+ New Architecture",
      "TurboModules C++",
      "Offline Sync (WatermelonDB)",
      "60 FPS Reanimated 3",
    ],
  });

  await seedSingleton(StatsSection, "stats section", {
    items: [
      { tag: "TENURE", value: "6+ Yrs", label: "Production Engineering" },
      { tag: "IMPACT", value: "4 Teams", label: "Commercial Scale-ups" },
      { tag: "SHIPPED APPS", value: "20+", label: "End-to-End Store Deployments" },
      { tag: "FIDELITY", value: "100%", label: "iOS & Android Parity" },
      { tag: "ACTIVE REACH", value: "100K+", label: "Store Downloads" },
    ],
  });

  await seedSingleton(CompaniesSection, "companies section", {
    eyebrow: "CLIENT ORGANIZATIONS & COMMERCIAL PARTNERSHIPS",
    title: "Trusted By & Contracted Across 4 High-Growth Tech Companies",
    badge: "4 COMMERCIAL DEPLOYMENTS",
  });

  await seedCollection(Company, "companies", [
    {
      monogram: "MTC",
      name: "Mobility Tech Corp",
      meta: "FLEET LOGISTICS & TELEMATICS · US",
      description:
        "Spearheaded real-time GPS dispatch architecture and Fabric 0.74 New Architecture upgrade for large-scale field drivers.",
      role: "Staff RN Engineer",
      period: "2023 – Present",
      badge: "ACTIVE FTE",
      order: 0,
    },
    {
      monogram: "FFS",
      name: "FinFlow Solutions",
      meta: "NEOBANK & MICRO-LENDING · EU",
      description:
        "Integrated iOS Secure Enclave biometric authentication & 1,000+ item zero-jank FlashList ledger virtualization.",
      role: "Senior Mobile Dev",
      period: "2022 – 2023",
      badge: "SERIES-B",
      order: 1,
    },
    {
      monogram: "LRS",
      name: "LogiRoute Systems",
      meta: "SUPPLY CHAIN & GEOTRACKING",
      description:
        "Engineered offline sync engine with WatermelonDB SQLite storage and native iOS/Android background location daemons.",
      role: "Mobile App Engineer",
      period: "2021 – 2022",
      badge: "ENTERPRISE IOT",
      order: 2,
    },
    {
      monogram: "AVS",
      name: "AppVenture Studio",
      meta: "HIGH-VELOCITY PRODUCT DELIVERY",
      description:
        "Shipped 8+ production apps to App Store & Play Store with automated Fastlane release CI/CD and atomic design systems.",
      role: "Mobile Engineer",
      period: "2020 – 2021",
      badge: "AGENCY LABS",
      order: 3,
    },
  ]);

  await seedSingleton(TechStackSection, "tech stack section", {
    eyebrow: "PRODUCTION INTEGRATION MATRIX",
    title: "Technology & Third-Party Integration Ecosystem",
    description:
      "Battle-tested integration experience spanning high-frequency real-time websockets, native telemetry hardware, enterprise BaaS, and payment processors.",
    badge: "18+ Production SDKs",
    cards: [
      {
        icon: "swap",
        title: "Real-Time & Sockets",
        tag: "SUB-50MS",
        description: "Bidirectional streaming channels, mesh connections, and vehicle presence.",
        items: ["Socket.IO Client", "WebSockets (RFC 6455)", "WebRTC Mobile SDK", "Firebase Realtime DB"],
        wide: false,
        metaLeft: "PROTOCOL: TCP / JSI",
        metaRight: "HEARTBEAT VERIFIED",
      },
      {
        icon: "pin",
        title: "Maps & Geolocation",
        tag: "PRECISION GPS",
        description: "Native vector mapping, live turn-by-turn routes, and background battery management.",
        items: ["Mapbox GL SDK", "Google Maps Platform", "GeoJSON Superclustering", "iOS CoreLocation", "Android FusedLocation"],
        wide: false,
        metaLeft: "ACCURACY: HIGH (<5M)",
        metaRight: "BACKGROUND GEO DAEMON",
      },
      {
        icon: "cloud",
        title: "Cloud, BaaS & Auth",
        tag: "ENTERPRISE BAAS",
        description: "Serverless mobile backends, cryptographic token storage, and distributed notifications.",
        items: ["Firebase Cloud Firestore", "Firebase Auth (OAuth)", "Firebase FCM & APNs", "Supabase / PostgREST", "AWS S3 Direct Upload"],
        wide: false,
        metaLeft: "SECURITY: OIDC / JWT",
        metaRight: "ZERO OVERHEAD",
      },
      {
        icon: "card",
        title: "Payments & FinTech",
        tag: "PCI-DSS LEVEL 1",
        description: "Native wallets, in-app microtransactions, and authenticated banking rails.",
        items: ["Stripe SDK (PaymentSheet)", "Apple Pay / Google Pay", "Plaid Link SDK", "RevenueCat (StoreKit 2)", "Razorpay Mobile"],
        wide: false,
        metaLeft: "TOKENIZATION: SECURE ENCLAVE",
        metaRight: "SCA COMPLIANT",
      },
      {
        icon: "layers",
        title: "Local Storage & Offline Sync Engines",
        tag: "OFFLINE-FIRST SYNCHRONIZATION",
        wide: true,
        description: "High-speed C++ key-value engines, reactive SQLite abstractions, and conflict resolution queues.",
        items: [
          "WatermelonDB (Reactive SQLite)",
          "react-native-mmkv (C++ JSI)",
          "Realm Mobile Database",
          "Zustand Persist Middleware",
          "SQLite Native Foreign Keys",
        ],
        metaLeft: "READ LATENCY: <0.5MS",
        metaRight: "DETERMINISTIC CONFLICT RESOLUTION",
      },
    ],
  });

  await seedSingleton(ExperienceSection, "experience section", {
    eyebrow: "TRACK RECORD",
    title: "Career & Systems Leadership across 4 Teams",
    badge: "EXP_CHRONO_2020_PRESENT",
  });

  await seedCollection(Experience, "experience", [
    {
      period: "2023 — PRESENT",
      role: "Senior React Native Engineer",
      company: "Mobility Tech Corp",
      focus: "Fleet, Driver Dispatch & Real-Time Telematics",
      status: "ACTIVE PRODUCTION",
      points: [
        "Architected high-throughput driver dispatch system ingesting 40,000+ real-time GPS coordinates per day via Socket.IO with zero UI thread freezing.",
        "Spearheaded zero-downtime migration to React Native 0.74 New Architecture (Fabric + C++ TurboModules), unlocking +35% rendering velocity.",
        "Overhauled Mapbox navigation camera transforms and clustering shaders, cutting driver device battery drain by 28%.",
      ],
      tech: ["Mapbox GL", "Socket.IO", "TurboModules", "Zustand"],
      order: 0,
    },
    {
      period: "2022 — 2023",
      role: "React Native Developer",
      company: "FinFlow Solutions",
      focus: "Neobank & Micro-Lending",
      tag: "SERIES-B FINTECH",
      points: [
        "Engineered biometric authentication module integrating iOS Secure Enclave & Android KeyStore with zero runtime overhead.",
        "Crafted zero-jank transaction feed capable of rendering 1,000+ ledger entries seamlessly via FlashList virtualization.",
      ],
      tech: ["Redux Toolkit", "Biometrics API", "SQLite", "React Navigation"],
      order: 1,
    },
    {
      period: "2021 — 2022",
      role: "Mobile App Engineer",
      company: "LogiRoute Systems",
      focus: "Supply Chain & Geotracking",
      tag: "SUPPLY CHAIN IOT",
      points: [
        "Designed cold-boot offline queue synchronization using WatermelonDB for field drivers traveling across dead-zones.",
        "Implemented background location daemon with native iOS CLLocationManager and Android Foreground Service bridges.",
      ],
      tech: ["WatermelonDB", "Background Fetch", "Kotlin", "Swift"],
      order: 2,
    },
    {
      period: "2020 — 2021",
      role: "Associate Mobile Developer",
      company: "AppVenture Studio",
      focus: "High-Velocity Client Mobile Delivery",
      tag: "RAPID AGENCY LABS",
      points: [
        "Delivered 8+ client mobile applications end-to-end from Figma designs to production deployment on Apple App Store and Google Play.",
        "Automated distribution pipelines with Fastlane, cutting regression release cycles from 3 days to under 45 minutes per app.",
      ],
      tech: ["React Native", "Firebase FCM", "Fastlane", "RESTful APIs"],
      order: 3,
    },
  ]);

  await seedSingleton(ProjectsSection, "projects section", {
    eyebrow: "SELECTED WORKS",
    title: "Featured Production Projects",
    categories: [
      { id: "all", label: "ALL" },
      { id: "realtime", label: "REAL-TIME & TELEMETRY" },
      { id: "maps", label: "MAPS & GPS" },
      { id: "native", label: "NATIVE C++" },
    ],
  });

  await seedCollection(Project, "projects", [
    {
      slug: "kwikride",
      name: "KwikRide",
      categories: ["realtime", "maps"],
      rating: "4.8",
      badges: ["MAPS & GPS", "FLEET ENGINE"],
      description:
        "Real-time driver dispatch & navigation application handling 15,000+ daily ride hails with sub-50ms coordinate synchronization.",
      stats: [
        { label: "ACTIVE RIDERS", value: "15,000+ DAU" },
        { label: "ARCHITECTURE", value: "RN 0.74 Fabric" },
      ],
      features: ["Live GPS trip tracking with predictive ETA", "Offline fare estimation cache", "Surge demand heat-map overlays"],
      tech: ["Mapbox GL", "Socket.IO", "Firebase FCM", "Node.js"],
      linkLabel: "Architecture Spec",
      meta: "IOS + ANDROID",
      links: {
        github: "https://github.com/subhojit-das",
        live: "",
        appStore: "https://apps.apple.com/",
        playStore: "https://play.google.com/store",
      },
      order: 0,
    },
    {
      slug: "metrotransit",
      name: "MetroTransit",
      categories: ["realtime"],
      rating: "4.9",
      badges: ["GESTURES", "REANIMATED 3"],
      description:
        "Smart rapid seat booking engine with custom Reanimated 3 pinch-to-zoom SVG vehicle floorplans and instant optimistic locks.",
      stats: [
        { label: "RENDER TARGET", value: "Zero Drop Frames" },
        { label: "CHECKOUT SPEED", value: "Apple/Google Pay" },
      ],
      features: ["Pinch-zoom SVG seat maps on the UI thread", "Optimistic seat locking with rollback", "Wallet-native one-tap checkout"],
      tech: ["React Native 0.73", "Reanimated 3", "Stripe SDK", "WebSockets"],
      linkLabel: "Interactive Case Study",
      meta: "STABLE STORE LIVE",
      links: {
        github: "https://github.com/subhojit-das",
        live: "https://example.com/metrotransit",
        appStore: "https://apps.apple.com/",
        playStore: "https://play.google.com/store",
      },
      order: 1,
    },
    {
      slug: "mediavault",
      name: "MediaVault Pro",
      categories: ["native"],
      rating: "4.7",
      badges: ["NATIVE C++", "TURBOMODULE"],
      description:
        "Multi-threaded parallel downloader bridging C++ worker threads via synchronous JSI to overcome standard JS thread throttling.",
      stats: [
        { label: "STORE REACH", value: "100K+ Installs" },
        { label: "SPEED GAIN", value: "4.2x Faster Chunking" },
      ],
      features: ["Parallel chunk downloads across worker threads", "Background transcoding via FFmpeg", "JSI direct memory access, no bridge copy"],
      tech: ["C++ TurboModules", "FFmpeg", "Android WorkManager", "BGTaskScheduler"],
      linkLabel: "View Native Bridge Code",
      meta: "JSI DIRECT SPEC",
      links: {
        github: "https://github.com/subhojit-das",
        live: "",
        appStore: "https://apps.apple.com/",
        playStore: "https://play.google.com/store",
      },
      order: 2,
    },
  ]);

  await seedSingleton(SkillsSection, "skills section", {
    eyebrow: "CORE CAPABILITIES",
    title: "Technical Proficiency & Architecture Matrix",
    description:
      "Engineering deep specialization spanning high-performance cross-platform runtimes, low-level JSI bridges, and enterprise deployment telemetry.",
    columns: [
      {
        icon: "device",
        title: "Mobile Core & Engine",
        description: "Next-gen runtime architecture and native bridge pipelines.",
        items: ["React Native 0.74+ & Expo EAS", "Fabric C++ Renderer", "Hermes JS Optimization", "TurboModules & JSI Sync", "Kotlin / Swift Custom Bridges"],
        meta: "BENCHMARK: ZERO-FRAME-DROP",
      },
      {
        icon: "database",
        title: "State & Persistence",
        description: "Deterministic offline databases and cache invalidation.",
        items: ["WatermelonDB (Offline-First)", "MMKV Key-Value (C++ Fast)", "Zustand State Stores", "Redux Toolkit & RTK Query", "TanStack React Query"],
        meta: "SYNC: RESILIENT RESOLUTION",
      },
      {
        icon: "pin",
        title: "Maps & Real-Time",
        description: "Low-latency geo-spatial routing and socket streaming.",
        items: ["Mapbox GL Mobile SDK", "Google Maps Dynamic Tiles", "Socket.IO Fleet Channels", "Native Background Geolocation", "GeoJSON Supercluster"],
        meta: "SOCKETS: 100K CONCURRENT",
      },
      {
        icon: "rocket",
        title: "DevOps & Release",
        description: "End-to-end continuous mobile integration and monitoring.",
        items: ["Fastlane Automation Lanes", "App Store Connect & Google Play", "Firebase FCM & Apple APNs", "Sentry Native Crash Analytics", "Xcode Instruments Profiling"],
        meta: "DEPLOY TIME: <45 MIN",
      },
    ],
  });

  await seedSingleton(ProcessSection, "process section", {
    eyebrow: "PIPELINE EXECUTION",
    title: "How I Ship Production Mobile Products",
    badge: "STANDARDS: ZERO REGRESSION CI",
    phases: [
      {
        no: "01",
        key: "PHASE_01",
        title: "Discover & Scope",
        description: "Analyze product requirements, audit native API feasibility, and establish frame budget limits.",
        meta: "AUDIT SPEC + REQ SIGN-OFF",
      },
      {
        no: "02",
        key: "PHASE_02",
        title: "Schema & Offline DB",
        description: "Design normalized local SQLite/WatermelonDB schemas and bidirectional sync queues.",
        meta: "WATERMELONDB MIGRATIONS",
      },
      {
        no: "03",
        key: "PHASE_03",
        title: "Develop & Animate",
        description: "Build components on Fabric, execute 60 FPS Reanimated 3 interactions on the UI thread.",
        meta: "FABRIC + TURBOMODULES",
      },
      {
        no: "04",
        key: "PHASE_04",
        title: "Profile & Stress Test",
        description: "Verify Hermes heap footprint, measure battery consumption via Xcode Instruments and Flipper.",
        meta: "PROFILING: NO LEAKS",
      },
      {
        no: "05",
        key: "PHASE_05",
        title: "Fastlane Release",
        description: "Automated signed binary upload to TestFlight and Google Play Internal Track simultaneously.",
        meta: "STORE DEPLOY: 100% CI",
      },
    ],
  });

  await seedSingleton(Resume, "resume", {
    eyebrow: "VERIFIED RESUME",
    badge: "Q3 2026 ACTIVE",
    name: "Subhojit Das",
    title: "Senior React Native Specialist / Mobile Systems Engineer",
    file: {
      url: "/Subhojit_Das_Resume.pdf",
      publicId: null,
      name: "Subhojit_Das_Senior_RN_CV.pdf",
      size: "2.4 MB",
      meta: "ATS FORMATTED · EXP: 2020–2026",
    },
    highlights: [
      "Complete technical timeline & commercial app portfolio list",
      "Documented C++ TurboModules & Fabric rendering benchmarks",
      "Direct references from Mobile VP and Startup CTOs",
    ],
    downloadLabel: "Download PDF CV",
    copyLabel: "Copy Email",
  });

  await seedSingleton(ContactSection, "contact section", {
    eyebrow: "ENGAGEMENT TRANSMISSION",
    title: "Initiate Direct Inquiry",
    description: "Seeking high-impact full-time mobile engineering positions or strategic contract lead roles.",
    email: "subhojit.das.dev@gmail.com",
    engagementTypes: [
      "Full-Time Senior / Staff Mobile Engineer",
      "Contract / Consulting Lead",
      "Short-Term Advisory",
      "Other",
    ],
    secureNote: "256-BIT ENCRYPTED DISPATCH",
    submitLabel: "Transmit Message",
  });

  await seedSingleton(SocialLinks, "social links", {
    primary: [
      { label: "GitHub", href: "https://github.com/subhojit-das", icon: "github" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/subhojit-das", icon: "linkedin" },
      { label: "Email", href: "mailto:subhojit.das.dev@gmail.com", icon: "mail" },
    ],
    footer: [
      { label: "GitHub", href: "https://github.com/subhojit-das", icon: "github" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/subhojit-das", icon: "linkedin" },
      { label: "Email", href: "mailto:subhojit.das.dev@gmail.com", icon: "mail" },
      { label: "X / Twitter", href: "https://x.com/subhojit_dev", icon: "x" },
    ],
  });

  await seedSingleton(FooterSection, "footer section", {
    description:
      "Senior React Native & Mobile Systems Engineer specializing in zero-jank 60/120 FPS pipelines, native bridges (C++, Objective-C, Kotlin), and enterprise distributed offline synchronization.",
    jumpsTitle: "ARCHITECTURE JUMPS",
    jumps: [
      { label: "Production Case Studies", href: "#projects" },
      { label: "Core Matrix & JSI", href: "#skills" },
      { label: "Performance Pipeline", href: "#process" },
      { label: "Engineering Leadership", href: "#experience" },
    ],
    statusTitle: "STATUS & TELEMETRY",
    statusLabel: "OPEN FOR CONTRACT / FTE",
    statusLines: ["LATENCY: ~16.4ms · ARCH: FABRIC/TURBOMODULES", "LOCATION: REMOTE (UTC+5:30)"],
    version: "v4.0.0-OBSIDIAN-KINETIC",
    rights: "© 2026 SUBHOJIT DAS // DEV. ALL RIGHTS RESERVED.",
    bottomLinks: ["Telemetry & Privacy", "Verified PGP"],
  });

  console.log("[seed:content] done");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[seed:content] failed:", err);
  process.exit(1);
});
