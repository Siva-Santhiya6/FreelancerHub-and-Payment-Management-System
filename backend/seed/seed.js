const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Milestone = require("../models/Milestone");
const Proposal = require("../models/Proposal");
const { Payment, Escrow } = require("../models/Payment");
const { Review, Notification } = require("../models/Review");

const seed = async (shouldDisconnect = false) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(
        process.env.MONGO_URI || "mongodb://localhost:27017/freelancerhub",
        { serverSelectionTimeoutMS: 8000 }
      );
    }

    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing demo data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Milestone.deleteMany({});
    await Proposal.deleteMany({});
    await Payment.deleteMany({});
    await Escrow.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});

    console.log("🧹 Existing demo data cleared");

    // ==============================
    // CREATE 5 DEMO USER ROLES
    // ==============================

    const admin = await User.create({
      name: "Admin User",
      email: "admin@freelancerhub.com",
      password: "Admin@123",
      role: "ADMIN",
      isVerified: true,
      trustScore: 100,
      country: "India",
      language: "en",
    });

    const client = await User.create({
      name: "Sarah Client",
      email: "client@freelancerhub.com",
      password: "Client@123",
      role: "CLIENT",
      isVerified: true,
      trustScore: 92,
      bio: "Tech startup founder building scalable web & AI products.",
      country: "India",
      language: "en",
    });

    const freelancer = await User.create({
      name: "Raj Freelancer",
      email: "freelancer@freelancerhub.com",
      password: "Freelancer@123",
      role: "FREELANCER",
      isVerified: true,
      skills: ["React", "Node.js", "MongoDB", "TypeScript", "Python", "UI/UX"],
      experience: 5,
      hourlyRate: 40,
      rating: 4.9,
      trustScore: 95,
      bio: "Senior Full-Stack Architect & AI Specialist with 5+ years building SaaS apps.",
      availability: "AVAILABLE",
      country: "India",
      language: "en",
    });

    const agency = await User.create({
      name: "Apex Studio Agency",
      email: "agency@freelancerhub.com",
      password: "Agency@123",
      role: "AGENCY_MANAGER",
      agencyName: "Apex Digital Solutions",
      agencySize: 12,
      isVerified: true,
      trustScore: 98,
      skills: ["Full Stack", "Mobile App", "DevOps", "Cloud Architecture", "UI/UX"],
      bio: "Top-rated enterprise agency managing end-to-end cloud and mobile ecosystems.",
      country: "India",
      language: "en",
    });

    const paymentMgr = await User.create({
      name: "Payment Manager",
      email: "payment@freelancerhub.com",
      password: "Payment@123",
      role: "PAYMENT_MANAGER",
      isVerified: true,
      trustScore: 99,
      country: "India",
      language: "en",
    });

    console.log("👥 5 Demo Roles created successfully");

    // ==============================
    // CREATE SAMPLE PROJECTS
    // ==============================

    const p1 = await Project.create({
      title: "E-Commerce Platform with React & Node.js",
      description: "Build a modern multi-vendor e-commerce platform with React, Node.js and MongoDB. Includes shopping cart, secure checkout, escrow payouts, and client inventory analytics dashboard.",
      clientId: client._id,
      category: "Web Development",
      skills: ["React", "Node.js", "MongoDB", "Redux", "Express"],
      budget: 5000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      teamSize: 2,
      status: "IN_PROGRESS",
      healthStatus: "HEALTHY",
      progress: 45,
    });

    const p2 = await Project.create({
      title: "Multilingual AI Chatbot for Customer Support",
      description: "Develop an autonomous multilingual chatbot using NLP for real-time customer support automation. Must natively support Tamil, Hindi, and English with voice audio.",
      clientId: client._id,
      category: "AI/ML",
      skills: ["Python", "NLP", "Machine Learning", "FastAPI", "React"],
      budget: 8000,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      teamSize: 1,
      status: "OPEN",
      healthStatus: "HEALTHY",
      progress: 10,
    });

    const p3 = await Project.create({
      title: "Fintech Mobile App UI/UX Design System",
      description: "Design a high-fidelity mobile banking and wallet app. Deliverable: Complete Figma design system with components, micro-animations, and dark mode tokens.",
      clientId: client._id,
      category: "Design",
      skills: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
      budget: 2500,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      teamSize: 1,
      status: "OPEN",
      healthStatus: "HEALTHY",
      progress: 0,
    });

    const p4 = await Project.create({
      title: "Kubernetes & CI/CD Pipeline Automation",
      description: "Setup automated GitHub Actions workflows, Docker containerization, and AWS EKS deployment with zero-downtime rolling updates and Prometheus monitoring.",
      clientId: client._id,
      category: "DevOps",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
      budget: 6500,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      teamSize: 1,
      status: "OPEN",
      healthStatus: "HEALTHY",
      progress: 0,
    });

    const p5 = await Project.create({
      title: "Real-time Analytics Dashboard & Data Pipeline",
      description: "Build an ETL data streaming pipeline with Apache Kafka and interactive analytics visualization using Recharts and Python data models.",
      clientId: client._id,
      category: "Data Science",
      skills: ["Python", "Data Science", "Kafka", "SQL", "React"],
      budget: 7200,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      teamSize: 2,
      status: "OPEN",
      healthStatus: "HEALTHY",
      progress: 0,
    });

    console.log("📁 5 Sample projects created");

    // ==============================
    // CREATE MILESTONES FOR PROJECT 1
    // ==============================

    const m1 = await Milestone.create({
      projectId: p1._id,
      title: "Frontend Setup & Authentication",
      description: "Setup React project, Redux store, and implement JWT authentication flow.",
      budget: 1000,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: "COMPLETED",
      progress: 100,
    });

    const m2 = await Milestone.create({
      projectId: p1._id,
      title: "Product Catalog & Cart System",
      description: "Build product listing, multi-filter search, and shopping cart state.",
      budget: 2000,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: "IN_PROGRESS",
      progress: 60,
    });

    const m3 = await Milestone.create({
      projectId: p1._id,
      title: "Checkout & Escrow Payment Integration",
      description: "Implement checkout flow, simulated payment gateway, and escrow locking.",
      budget: 2000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "NOT_STARTED",
      progress: 0,
    });

    p1.milestoneIds = [m1._id, m2._id, m3._id];
    await p1.save();

    console.log("🎯 Sample milestones created");

    // ==============================
    // CREATE PROPOSALS
    // ==============================

    const prop1 = await Proposal.create({
      projectId: p1._id,
      freelancerId: freelancer._id,
      coverLetter: "I have 5+ years of experience in React and Node.js architecture. I have built 10+ e-commerce platforms with escrow workflows. Excited to deliver high performance code.",
      bidAmount: 5000,
      estimatedDuration: "3 weeks",
      status: "ACCEPTED",
      matchScore: 95,
    });

    const prop2 = await Proposal.create({
      projectId: p2._id,
      freelancerId: freelancer._id,
      coverLetter: "I specialize in NLP engines and multilingual conversational AI with Tamil/Hindi audio processing. I can deliver full customer support automation.",
      bidAmount: 7800,
      estimatedDuration: "4 weeks",
      status: "SUBMITTED",
      matchScore: 90,
    });

    p1.proposalIds.push(prop1._id);
    await p1.save();
    p2.proposalIds.push(prop2._id);
    await p2.save();

    console.log("📝 Sample proposals created");

    // ==============================
    // CREATE ESCROW & PAYMENTS
    // ==============================

    await Escrow.create({
      projectId: p1._id,
      clientId: client._id,
      totalAmount: 5000,
      fundedAmount: 5000,
      releasedAmount: 1000,
      pendingAmount: 4000,
      status: "PARTIALLY_FUNDED",
    });

    await Payment.create({
      projectId: p1._id,
      milestoneId: m1._id,
      clientId: client._id,
      freelancerId: freelancer._id,
      amount: 1000,
      status: "COMPLETED",
      paymentMethod: "ESCROW_RELEASE",
      transactionId: `TXN_${Date.now()}_M1`,
    });

    console.log("💳 Escrow and payment records created");
    console.log("✅ Database successfully seeded with 5 full roles!");

  } catch (error) {
    console.error("❌ Seed Error:", error.message);
  } finally {
    if (shouldDisconnect) {
      await mongoose.disconnect();
      console.log("🔌 MongoDB connection closed");
    }
  }
};

if (require.main === module) {
  seed(true);
}

module.exports = seed;