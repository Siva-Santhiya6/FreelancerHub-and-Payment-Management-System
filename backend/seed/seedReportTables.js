const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');

const seedAllTablesWithRichData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/freelancerhub';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas');

    const db = mongoose.connection.db;

    // Drop old duplicate or leftover collections
    const collectionsToClean = [
      'users', 'projects', 'proposals', 'milestones', 'payments',
      'escrows', 'notifications', 'reviews',
      'tbl_User', 'tbl_Client', 'tbl_Freelancer', 'tbl_Project',
      'tbl_Proposal', 'tbl_Team', 'tbl_TeamMember', 'tbl_Milestone',
      'tbl_EscrowPayment', 'tbl_Payment', 'tbl_Transaction', 'tbl_Portfolio',
      'tbl_PortfolioVerification', 'tbl_Certificate', 'tbl_CertificateWallet',
      'tbl_SkillVerification', 'tbl_Message', 'tbl_Notification'
    ];

    for (const colName of collectionsToClean) {
      try {
        await db.collection(colName).drop();
      } catch (e) {
        // Ignore if collection does not exist
      }
    }

    // ==========================================
    // 1. User (8 Entities)
    // ==========================================
    const users = [
      {
        User_Id: 101,
        Full_Name: "Siva Santhiya",
        Email: "siva.client@freelancerhub.com",
        Password: "$2a$12$hashedPasswordClient123",
        Phone: "+91 9876543210",
        Role: "CLIENT",
        Address: "Chennai, Tamil Nadu, India",
        Profile_Image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        Status: "ACTIVE",
        Created_At: new Date("2024-01-15T10:30:00Z")
      },
      {
        User_Id: 102,
        Full_Name: "Rajesh Kumar",
        Email: "rajesh.freelancer@freelancerhub.com",
        Password: "$2a$12$hashedPasswordFreelancer123",
        Phone: "+91 9876543211",
        Role: "FREELANCER",
        Address: "Coimbatore, Tamil Nadu, India",
        Profile_Image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        Status: "ACTIVE",
        Created_At: new Date("2024-01-16T11:00:00Z")
      },
      {
        User_Id: 103,
        Full_Name: "Apex Agency Admin",
        Email: "agency@freelancerhub.com",
        Password: "$2a$12$hashedPasswordAgency123",
        Phone: "+91 9876543212",
        Role: "AGENCY_MANAGER",
        Address: "Bengaluru, Karnataka, India",
        Profile_Image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        Status: "ACTIVE",
        Created_At: new Date("2024-01-17T09:15:00Z")
      },
      {
        User_Id: 104,
        Full_Name: "Finance Escrow Officer",
        Email: "payment@freelancerhub.com",
        Password: "$2a$12$hashedPasswordPayment123",
        Phone: "+91 9876543213",
        Role: "PAYMENT_MANAGER",
        Address: "Mumbai, Maharashtra, India",
        Profile_Image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        Status: "ACTIVE",
        Created_At: new Date("2024-01-18T14:20:00Z")
      },
      {
        User_Id: 105,
        Full_Name: "System Administrator",
        Email: "admin@freelancerhub.com",
        Password: "$2a$12$hashedPasswordAdmin123",
        Phone: "+91 9876543214",
        Role: "ADMIN",
        Address: "Hyderabad, Telangana, India",
        Profile_Image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        Status: "ACTIVE",
        Created_At: new Date("2024-01-19T08:00:00Z")
      },
      {
        User_Id: 106,
        Full_Name: "Ananya Sharma",
        Email: "ananya.client@freelancerhub.com",
        Password: "$2a$12$hashedPasswordClient456",
        Phone: "+91 9876543215",
        Role: "CLIENT",
        Address: "Pune, Maharashtra, India",
        Profile_Image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        Status: "ACTIVE",
        Created_At: new Date("2024-01-20T09:40:00Z")
      },
      {
        User_Id: 107,
        Full_Name: "Priya Dharshini",
        Email: "priya.uiux@freelancerhub.com",
        Password: "$2a$12$hashedPasswordPriya123",
        Phone: "+91 9876543216",
        Role: "FREELANCER",
        Address: "Madurai, Tamil Nadu, India",
        Profile_Image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        Status: "ACTIVE",
        Created_At: new Date("2024-01-21T10:15:00Z")
      },
      {
        User_Id: 108,
        Full_Name: "Vikram Aditya",
        Email: "vikram.devops@freelancerhub.com",
        Password: "$2a$12$hashedPasswordVikram123",
        Phone: "+91 9876543217",
        Role: "FREELANCER",
        Address: "Kochi, Kerala, India",
        Profile_Image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        Status: "ACTIVE",
        Created_At: new Date("2024-01-22T11:50:00Z")
      }
    ];

    // ==========================================
    // 2. Client (6 Entities)
    // ==========================================
    const clients = [
      {
        Client_Id: 201,
        User_Id: 101,
        Company_Name: "NextGen Cloud Solutions",
        Industry: "Information Technology",
        Company_Website: "https://nextgencloud.io"
      },
      {
        Client_Id: 202,
        User_Id: 106,
        Company_Name: "HealthTech Innovations",
        Industry: "Healthcare & MedTech",
        Company_Website: "https://healthtechinno.com"
      },
      {
        Client_Id: 203,
        User_Id: 101,
        Company_Name: "FinEdge Digital Corp",
        Industry: "Fintech & Banking",
        Company_Website: "https://finedgedigital.co"
      },
      {
        Client_Id: 204,
        User_Id: 106,
        Company_Name: "EduSmart Learning Systems",
        Industry: "Education & EdTech",
        Company_Website: "https://edusmartlearning.org"
      },
      {
        Client_Id: 205,
        User_Id: 101,
        Company_Name: "Quantum Logistics & Supply",
        Industry: "Supply Chain & Logistics",
        Company_Website: "https://quantumlogistics.in"
      },
      {
        Client_Id: 206,
        User_Id: 106,
        Company_Name: "EcoRetail Global E-Commerce",
        Industry: "Retail & E-Commerce",
        Company_Website: "https://ecoretailglobal.shop"
      }
    ];

    // ==========================================
    // 3. Freelancer (6 Entities)
    // ==========================================
    const freelancers = [
      {
        Freelancer_Id: 301,
        User_Id: 102,
        Bio: "Senior Full-Stack Architect & AI Specialist with 5+ years building scalable SaaS web platforms.",
        Hourly_Rate: 45.00,
        Experience: 5,
        Availability: "AVAILABLE",
        Trust_Score: 98.50
      },
      {
        Freelancer_Id: 302,
        User_Id: 107,
        Bio: "Lead UI/UX Designer & Design Systems Specialist proficient in Figma and accessibility.",
        Hourly_Rate: 40.00,
        Experience: 4,
        Availability: "AVAILABLE",
        Trust_Score: 96.00
      },
      {
        Freelancer_Id: 303,
        User_Id: 108,
        Bio: "Cloud Infrastructure & DevOps Engineer specialized in Docker, Kubernetes, and AWS pipelines.",
        Hourly_Rate: 55.00,
        Experience: 6,
        Availability: "AVAILABLE",
        Trust_Score: 99.00
      },
      {
        Freelancer_Id: 304,
        User_Id: 102,
        Bio: "Python Machine Learning & NLP Engineer building intelligent multilingual conversational engines.",
        Hourly_Rate: 50.00,
        Experience: 4,
        Availability: "AVAILABLE",
        Trust_Score: 94.50
      },
      {
        Freelancer_Id: 305,
        User_Id: 107,
        Bio: "Mobile App Developer creating cross-platform iOS and Android apps with React Native.",
        Hourly_Rate: 38.00,
        Experience: 3,
        Availability: "AVAILABLE",
        Trust_Score: 95.00
      },
      {
        Freelancer_Id: 306,
        User_Id: 108,
        Bio: "Smart Contract & Escrow Security Specialist auditing decentralized and financial workflows.",
        Hourly_Rate: 60.00,
        Experience: 5,
        Availability: "BUSY",
        Trust_Score: 97.50
      }
    ];

    // ==========================================
    // 4. Project (6 Entities)
    // ==========================================
    const projects = [
      {
        Project_Id: 401,
        Client_Id: 201,
        Title: "E-Commerce Platform with React & Node.js",
        Description: "Build a modern multi-vendor e-commerce platform with catalog, shopping cart, escrow gateway, and order tracking.",
        Budget: 5000.00,
        Deadline: new Date("2025-05-30T23:59:59Z"),
        Status: "IN_PROGRESS",
        Created_At: new Date("2024-02-01T10:00:00Z")
      },
      {
        Project_Id: 402,
        Client_Id: 202,
        Title: "Multilingual AI Chatbot for Customer Support",
        Description: "Develop an autonomous multilingual chatbot supporting Tamil, Hindi, and English voice commands.",
        Budget: 8000.00,
        Deadline: new Date("2025-06-15T23:59:59Z"),
        Status: "OPEN",
        Created_At: new Date("2024-02-05T12:30:00Z")
      },
      {
        Project_Id: 403,
        Client_Id: 203,
        Title: "Fintech Mobile App UI/UX Design System",
        Description: "Complete Figma design system with components, micro-animations, and sleek dark mode design tokens.",
        Budget: 2500.00,
        Deadline: new Date("2025-04-20T23:59:59Z"),
        Status: "OPEN",
        Created_At: new Date("2024-02-10T15:45:00Z")
      },
      {
        Project_Id: 404,
        Client_Id: 204,
        Title: "Kubernetes & CI/CD Pipeline Automation",
        Description: "Setup automated GitHub Actions workflows, Docker containerization, and zero-downtime cluster updates.",
        Budget: 6500.00,
        Deadline: new Date("2025-05-15T23:59:59Z"),
        Status: "IN_PROGRESS",
        Created_At: new Date("2024-02-12T11:00:00Z")
      },
      {
        Project_Id: 405,
        Client_Id: 205,
        Title: "Real-time Analytics Dashboard & Kafka Pipeline",
        Description: "Build streaming data ingestion with Apache Kafka and dynamic analytics charts using Recharts.",
        Budget: 7200.00,
        Deadline: new Date("2025-06-01T23:59:59Z"),
        Status: "OPEN",
        Created_At: new Date("2024-02-15T14:20:00Z")
      },
      {
        Project_Id: 406,
        Client_Id: 206,
        Title: "Decentralized Escrow Governance & Audit Suite",
        Description: "Autonomous smart escrow multi-signature release vault with real-time audit logging and mediation rules.",
        Budget: 9500.00,
        Deadline: new Date("2025-07-10T23:59:59Z"),
        Status: "OPEN",
        Created_At: new Date("2024-02-18T16:00:00Z")
      }
    ];

    // ==========================================
    // 5. Proposal (6 Entities)
    // ==========================================
    const proposals = [
      {
        Proposal_Id: 501,
        Project_Id: 401,
        Freelancer_Id: 301,
        Cover_Letter: "I have 5+ years of experience delivering robust MERN apps and automated escrow workflows with clean code.",
        Bid_Amount: 5000.00,
        Delivery_Days: 21,
        Status: "ACCEPTED"
      },
      {
        Proposal_Id: 502,
        Project_Id: 402,
        Freelancer_Id: 304,
        Cover_Letter: "I specialize in NLP conversational engines with native Tamil, Hindi, and English audio voice processing.",
        Bid_Amount: 7800.00,
        Delivery_Days: 30,
        Status: "SUBMITTED"
      },
      {
        Proposal_Id: 503,
        Project_Id: 403,
        Freelancer_Id: 302,
        Cover_Letter: "I will design an ultra-modern Fintech mobile UI/UX in Figma with comprehensive design tokens and prototypes.",
        Bid_Amount: 2400.00,
        Delivery_Days: 14,
        Status: "ACCEPTED"
      },
      {
        Proposal_Id: 504,
        Project_Id: 404,
        Freelancer_Id: 303,
        Cover_Letter: "Expert in Kubernetes, Docker, and AWS EKS. I will build an automated CI/CD pipeline with zero downtime.",
        Bid_Amount: 6200.00,
        Delivery_Days: 25,
        Status: "ACCEPTED"
      },
      {
        Proposal_Id: 505,
        Project_Id: 405,
        Freelancer_Id: 304,
        Cover_Letter: "I have built streaming analytics dashboards with Kafka and React. Ready to architect high-throughput streams.",
        Bid_Amount: 7000.00,
        Delivery_Days: 28,
        Status: "SUBMITTED"
      },
      {
        Proposal_Id: 506,
        Project_Id: 406,
        Freelancer_Id: 306,
        Cover_Letter: "Specialized in secure financial escrow contracts and automated milestone arbitration protocols.",
        Bid_Amount: 9200.00,
        Delivery_Days: 35,
        Status: "SUBMITTED"
      }
    ];

    // ==========================================
    // 6. Team (6 Entities)
    // ==========================================
    const teams = [
      {
        Team_Id: 601,
        Project_Id: 401,
        Team_Name: "Apex Frontend & FullStack Squad",
        Created_At: new Date("2024-02-03T11:00:00Z")
      },
      {
        Team_Id: 602,
        Project_Id: 402,
        Team_Name: "NLP & Conversational AI Core",
        Created_At: new Date("2024-02-06T10:30:00Z")
      },
      {
        Team_Id: 603,
        Project_Id: 403,
        Team_Name: "UI/UX Creative Design Team",
        Created_At: new Date("2024-02-11T14:00:00Z")
      },
      {
        Team_Id: 604,
        Project_Id: 404,
        Team_Name: "Cloud & DevOps Automation Unit",
        Created_At: new Date("2024-02-13T09:15:00Z")
      },
      {
        Team_Id: 605,
        Project_Id: 405,
        Team_Name: "Data Analytics & Streaming Squad",
        Created_At: new Date("2024-02-16T12:00:00Z")
      },
      {
        Team_Id: 606,
        Project_Id: 406,
        Team_Name: "Web3 & Escrow Security Taskforce",
        Created_At: new Date("2024-02-19T15:30:00Z")
      }
    ];

    // ==========================================
    // 7. TeamMember (6 Entities)
    // ==========================================
    const teamMembers = [
      {
        Member_Id: 701,
        Team_Id: 601,
        Freelancer_Id: 301,
        Role: "Lead Full-Stack Developer",
        Joined_At: new Date("2024-02-03T11:30:00Z")
      },
      {
        Member_Id: 702,
        Team_Id: 602,
        Freelancer_Id: 304,
        Role: "NLP Engine Architect",
        Joined_At: new Date("2024-02-06T11:00:00Z")
      },
      {
        Member_Id: 703,
        Team_Id: 603,
        Freelancer_Id: 302,
        Role: "Principal Product Designer",
        Joined_At: new Date("2024-02-11T14:30:00Z")
      },
      {
        Member_Id: 704,
        Team_Id: 604,
        Freelancer_Id: 303,
        Role: "Lead DevOps Engineer",
        Joined_At: new Date("2024-02-13T09:45:00Z")
      },
      {
        Member_Id: 705,
        Team_Id: 605,
        Freelancer_Id: 304,
        Role: "Senior Data Pipeline Engineer",
        Joined_At: new Date("2024-02-16T12:30:00Z")
      },
      {
        Member_Id: 706,
        Team_Id: 606,
        Freelancer_Id: 306,
        Role: "Escrow Protocol Security Specialist",
        Joined_At: new Date("2024-02-19T16:00:00Z")
      }
    ];

    // ==========================================
    // 8. Milestone (6 Entities)
    // ==========================================
    const milestones = [
      {
        Milestone_Id: 801,
        Project_Id: 401,
        Title: "Frontend Architecture & JWT Authentication",
        Description: "Setup React 18, Redux Toolkit, and secure authentication flow.",
        Amount: 1000.00,
        Due_Date: new Date("2025-03-10T23:59:59Z"),
        Status: "COMPLETED"
      },
      {
        Milestone_Id: 802,
        Project_Id: 401,
        Title: "Product Catalog & Cart State Management",
        Description: "Build multi-filter product search, cart operations, and local persistence.",
        Amount: 2000.00,
        Due_Date: new Date("2025-03-25T23:59:59Z"),
        Status: "IN_PROGRESS"
      },
      {
        Milestone_Id: 803,
        Project_Id: 401,
        Title: "Checkout & Escrow Payment Gateway",
        Description: "Escrow release workflow, order confirmation, and automated invoicing.",
        Amount: 2000.00,
        Due_Date: new Date("2025-04-15T23:59:59Z"),
        Status: "NOT_STARTED"
      },
      {
        Milestone_Id: 804,
        Project_Id: 403,
        Title: "Design System Tokens & User Flow Wireframes",
        Description: "Initial user journey maps, typography tokens, and high-fidelity wireframes.",
        Amount: 800.00,
        Due_Date: new Date("2025-03-15T23:59:59Z"),
        Status: "COMPLETED"
      },
      {
        Milestone_Id: 805,
        Project_Id: 403,
        Title: "Interactive Prototype & Micro-Animations",
        Description: "Interactive Figma prototype with wallet screens and transaction micro-interactions.",
        Amount: 1200.00,
        Due_Date: new Date("2025-04-05T23:59:59Z"),
        Status: "IN_PROGRESS"
      },
      {
        Milestone_Id: 806,
        Project_Id: 404,
        Title: "Docker Containerization & GitHub Actions CI/CD",
        Description: "Automated Docker build scripts, testing matrix, and deployment pipelines.",
        Amount: 2500.00,
        Due_Date: new Date("2025-04-10T23:59:59Z"),
        Status: "IN_PROGRESS"
      }
    ];

    // ==========================================
    // 9. EscrowPayment (6 Entities)
    // ==========================================
    const escrowPayments = [
      {
        Escrow_Id: 901,
        Project_Id: 401,
        Total_Amount: 5000.00,
        Deposited_Date: new Date("2024-02-02T14:00:00Z"),
        Status: "FUNDED"
      },
      {
        Escrow_Id: 902,
        Project_Id: 402,
        Total_Amount: 8000.00,
        Deposited_Date: new Date("2024-02-06T10:00:00Z"),
        Status: "UNFUNDED"
      },
      {
        Escrow_Id: 903,
        Project_Id: 403,
        Total_Amount: 2500.00,
        Deposited_Date: new Date("2024-02-11T16:00:00Z"),
        Status: "FUNDED"
      },
      {
        Escrow_Id: 904,
        Project_Id: 404,
        Total_Amount: 6500.00,
        Deposited_Date: new Date("2024-02-14T11:30:00Z"),
        Status: "FUNDED"
      },
      {
        Escrow_Id: 905,
        Project_Id: 405,
        Total_Amount: 7200.00,
        Deposited_Date: new Date("2024-02-17T09:00:00Z"),
        Status: "UNFUNDED"
      },
      {
        Escrow_Id: 906,
        Project_Id: 406,
        Total_Amount: 9500.00,
        Deposited_Date: new Date("2024-02-20T13:45:00Z"),
        Status: "UNFUNDED"
      }
    ];

    // ==========================================
    // 10. Payment (6 Entities)
    // ==========================================
    const payments = [
      {
        Payment_Id: 1001,
        Escrow_Id: 901,
        Milestone_Id: 801,
        Amount: 1000.00,
        Payment_Method: "ESCROW_VAULT",
        Payment_Date: new Date("2024-03-10T16:45:00Z"),
        Status: "COMPLETED"
      },
      {
        Payment_Id: 1002,
        Escrow_Id: 901,
        Milestone_Id: 802,
        Amount: 2000.00,
        Payment_Method: "ESCROW_VAULT",
        Payment_Date: new Date("2024-03-25T17:00:00Z"),
        Status: "PENDING"
      },
      {
        Payment_Id: 1003,
        Escrow_Id: 903,
        Milestone_Id: 804,
        Amount: 800.00,
        Payment_Method: "ESCROW_VAULT",
        Payment_Date: new Date("2024-03-15T15:30:00Z"),
        Status: "COMPLETED"
      },
      {
        Payment_Id: 1004,
        Escrow_Id: 903,
        Milestone_Id: 805,
        Amount: 1200.00,
        Payment_Method: "ESCROW_VAULT",
        Payment_Date: new Date("2024-04-05T14:15:00Z"),
        Status: "PROCESSING"
      },
      {
        Payment_Id: 1005,
        Escrow_Id: 904,
        Milestone_Id: 806,
        Amount: 2500.00,
        Payment_Method: "ESCROW_VAULT",
        Payment_Date: new Date("2024-04-10T18:00:00Z"),
        Status: "PROCESSING"
      },
      {
        Payment_Id: 1006,
        Escrow_Id: 901,
        Milestone_Id: 803,
        Amount: 2000.00,
        Payment_Method: "ESCROW_VAULT",
        Payment_Date: new Date("2024-04-15T11:00:00Z"),
        Status: "PENDING"
      }
    ];

    // ==========================================
    // 11. Transaction (6 Entities)
    // ==========================================
    const transactions = [
      {
        Transaction_Id: 1101,
        Payment_Id: 1001,
        Transaction_Type: "MILESTONE_RELEASE",
        Amount: 1000.00,
        Transaction_Date: new Date("2024-03-10T16:45:30Z"),
        Status: "SUCCESS"
      },
      {
        Transaction_Id: 1102,
        Payment_Id: 1003,
        Transaction_Type: "MILESTONE_RELEASE",
        Amount: 800.00,
        Transaction_Date: new Date("2024-03-15T15:30:45Z"),
        Status: "SUCCESS"
      },
      {
        Transaction_Id: 1103,
        Payment_Id: 1001,
        Transaction_Type: "ESCROW_DEPOSIT",
        Amount: 5000.00,
        Transaction_Date: new Date("2024-02-02T14:05:00Z"),
        Status: "SUCCESS"
      },
      {
        Transaction_Id: 1104,
        Payment_Id: 1003,
        Transaction_Type: "ESCROW_DEPOSIT",
        Amount: 2500.00,
        Transaction_Date: new Date("2024-02-11T16:05:00Z"),
        Status: "SUCCESS"
      },
      {
        Transaction_Id: 1105,
        Payment_Id: 1005,
        Transaction_Type: "ESCROW_DEPOSIT",
        Amount: 6500.00,
        Transaction_Date: new Date("2024-02-14T11:35:00Z"),
        Status: "SUCCESS"
      },
      {
        Transaction_Id: 1106,
        Payment_Id: 1004,
        Transaction_Type: "PLATFORM_FEE_DEDUCTION",
        Amount: 120.00,
        Transaction_Date: new Date("2024-04-05T14:16:00Z"),
        Status: "SUCCESS"
      }
    ];

    // ==========================================
    // 12. Portfolio (6 Entities)
    // ==========================================
    const portfolios = [
      {
        Portfolio_Id: 1201,
        Freelancer_Id: 301,
        Title: "Enterprise SaaS Cloud Portal",
        Description: "Multi-tenant SaaS application built with React, Redux, Node.js, and MongoDB.",
        Project_URL: "https://freelancerhub-demo.vercel.app",
        Technologies: "React 18, Node.js, Express, MongoDB, Redux Toolkit"
      },
      {
        Portfolio_Id: 1202,
        Freelancer_Id: 302,
        Title: "Fintech Banking Design System",
        Description: "Full design system library with 200+ components, auto-layout, and accessibility tokens.",
        Project_URL: "https://figma.com/@finedgedesign",
        Technologies: "Figma, Prototyping, Design Systems, UX Research"
      },
      {
        Portfolio_Id: 1203,
        Freelancer_Id: 303,
        Title: "Kubernetes Zero-Downtime Cluster",
        Description: "Production-ready AWS EKS deployment with Prometheus monitoring and Grafana alerts.",
        Project_URL: "https://github.com/infra/k8s-cluster",
        Technologies: "Docker, Kubernetes, AWS EKS, Terraform, CI/CD"
      },
      {
        Portfolio_Id: 1204,
        Freelancer_Id: 304,
        Title: "Multilingual AI Conversational Engine",
        Description: "Intelligent NLP model supporting Tamil, Hindi, and English voice speech-to-text.",
        Project_URL: "https://nlp-ai-engine.io",
        Technologies: "Python, FastAPI, PyTorch, HuggingFace, NLP"
      },
      {
        Portfolio_Id: 1205,
        Freelancer_Id: 305,
        Title: "Cross-Platform E-Learning Mobile App",
        Description: "Interactive learning app with video lectures, offline quizzes, and push notifications.",
        Project_URL: "https://edusmartmobile.app",
        Technologies: "React Native, Expo, Redux, Node.js"
      },
      {
        Portfolio_Id: 1206,
        Freelancer_Id: 306,
        Title: "Escrow Smart Contract Suite",
        Description: "Audited milestone escrow contracts ensuring zero-risk payments for freelance ecosystems.",
        Project_URL: "https://etherscan.io/address/0xescrow",
        Technologies: "Solidity, Ethereum, Web3.js, Hardhat"
      }
    ];

    // ==========================================
    // 13. PortfolioVerification (6 Entities)
    // ==========================================
    const portfolioVerifications = [
      {
        Verification_Id: 1301,
        Portfolio_Id: 1201,
        Verified_By: 105,
        Status: "VERIFIED",
        Verified_At: new Date("2024-01-20T10:00:00Z")
      },
      {
        Verification_Id: 1302,
        Portfolio_Id: 1202,
        Verified_By: 105,
        Status: "VERIFIED",
        Verified_At: new Date("2024-01-21T11:15:00Z")
      },
      {
        Verification_Id: 1303,
        Portfolio_Id: 1203,
        Verified_By: 105,
        Status: "VERIFIED",
        Verified_At: new Date("2024-01-22T14:30:00Z")
      },
      {
        Verification_Id: 1304,
        Portfolio_Id: 1204,
        Verified_By: 105,
        Status: "VERIFIED",
        Verified_At: new Date("2024-01-23T09:45:00Z")
      },
      {
        Verification_Id: 1305,
        Portfolio_Id: 1205,
        Verified_By: 105,
        Status: "VERIFIED",
        Verified_At: new Date("2024-01-24T16:00:00Z")
      },
      {
        Verification_Id: 1306,
        Portfolio_Id: 1206,
        Verified_By: 105,
        Status: "VERIFIED",
        Verified_At: new Date("2024-01-25T13:20:00Z")
      }
    ];

    // ==========================================
    // 14. Certificate (6 Entities)
    // ==========================================
    const certificates = [
      {
        Certificate_Id: 1401,
        Wallet_Id: 1501,
        Title: "Full-Stack Web Development Certified Specialist",
        Organization: "MongoDB & Node.js University",
        Issue_Date: new Date("2023-11-15"),
        Credential_URL: "https://credentials.example.com/cert/1401"
      },
      {
        Certificate_Id: 1402,
        Wallet_Id: 1502,
        Title: "Advanced Design Systems & UX Architecture",
        Organization: "Interaction Design Foundation",
        Issue_Date: new Date("2023-10-20"),
        Credential_URL: "https://credentials.example.com/cert/1402"
      },
      {
        Certificate_Id: 1403,
        Wallet_Id: 1503,
        Title: "Certified Kubernetes Administrator (CKA)",
        Organization: "Cloud Native Computing Foundation",
        Issue_Date: new Date("2023-09-10"),
        Credential_URL: "https://credentials.example.com/cert/1403"
      },
      {
        Certificate_Id: 1404,
        Wallet_Id: 1504,
        Title: "Professional Machine Learning & NLP Engineer",
        Organization: "DeepLearning.AI",
        Issue_Date: new Date("2023-12-05"),
        Credential_URL: "https://credentials.example.com/cert/1404"
      },
      {
        Certificate_Id: 1405,
        Wallet_Id: 1505,
        Title: "React Native Mobile Architecture Specialist",
        Organization: "Meta Certification Program",
        Issue_Date: new Date("2023-08-18"),
        Credential_URL: "https://credentials.example.com/cert/1405"
      },
      {
        Certificate_Id: 1406,
        Wallet_Id: 1506,
        Title: "Certified Blockchain & Smart Contract Architect",
        Organization: "Blockchain Training Alliance",
        Issue_Date: new Date("2023-07-25"),
        Credential_URL: "https://credentials.example.com/cert/1406"
      }
    ];

    // ==========================================
    // 15. CertificateWallet (6 Entities)
    // ==========================================
    const certificateWallets = [
      {
        Wallet_Id: 1501,
        Freelancer_Id: 301,
        Verification_Status: "VERIFIED"
      },
      {
        Wallet_Id: 1502,
        Freelancer_Id: 302,
        Verification_Status: "VERIFIED"
      },
      {
        Wallet_Id: 1503,
        Freelancer_Id: 303,
        Verification_Status: "VERIFIED"
      },
      {
        Wallet_Id: 1504,
        Freelancer_Id: 304,
        Verification_Status: "VERIFIED"
      },
      {
        Wallet_Id: 1505,
        Freelancer_Id: 305,
        Verification_Status: "VERIFIED"
      },
      {
        Wallet_Id: 1506,
        Freelancer_Id: 306,
        Verification_Status: "VERIFIED"
      }
    ];

    // ==========================================
    // 16. SkillVerification (6 Entities)
    // ==========================================
    const skillVerifications = [
      {
        Verification_Id: 1601,
        Skill_Id: 1,
        Verified_By: 105,
        Status: "BADGE_AWARDED",
        Verified_At: new Date("2024-01-22T14:30:00Z")
      },
      {
        Verification_Id: 1602,
        Skill_Id: 2,
        Verified_By: 105,
        Status: "BADGE_AWARDED",
        Verified_At: new Date("2024-01-23T10:00:00Z")
      },
      {
        Verification_Id: 1603,
        Skill_Id: 3,
        Verified_By: 105,
        Status: "BADGE_AWARDED",
        Verified_At: new Date("2024-01-24T15:45:00Z")
      },
      {
        Verification_Id: 1604,
        Skill_Id: 4,
        Verified_By: 105,
        Status: "BADGE_AWARDED",
        Verified_At: new Date("2024-01-25T11:20:00Z")
      },
      {
        Verification_Id: 1605,
        Skill_Id: 5,
        Verified_By: 105,
        Status: "BADGE_AWARDED",
        Verified_At: new Date("2024-01-26T09:30:00Z")
      },
      {
        Verification_Id: 1606,
        Skill_Id: 6,
        Verified_By: 105,
        Status: "BADGE_AWARDED",
        Verified_At: new Date("2024-01-27T16:15:00Z")
      }
    ];

    // ==========================================
    // 17. Message (6 Entities)
    // ==========================================
    const messages = [
      {
        Message_Id: 1701,
        Sender_Id: 101,
        Receiver_Id: 102,
        Content: "Hello Rajesh! Milestone 1 deliverables look exceptional. Releasing the escrow payment now.",
        Timestamp: new Date("2024-03-10T16:40:00Z"),
        Is_Read: true
      },
      {
        Message_Id: 1702,
        Sender_Id: 102,
        Receiver_Id: 101,
        Content: "Thank you Siva! I have started work on Milestone 2 (Product Catalog & Cart).",
        Timestamp: new Date("2024-03-10T16:50:00Z"),
        Is_Read: true
      },
      {
        Message_Id: 1703,
        Sender_Id: 106,
        Receiver_Id: 107,
        Content: "Hi Priya, could you please share the updated Figma link for the Fintech wallet screens?",
        Timestamp: new Date("2024-03-12T10:15:00Z"),
        Is_Read: true
      },
      {
        Message_Id: 1704,
        Sender_Id: 107,
        Receiver_Id: 106,
        Content: "Hi Ananya! The wireframes and dark mode design system tokens are published in Figma.",
        Timestamp: new Date("2024-03-12T10:45:00Z"),
        Is_Read: true
      },
      {
        Message_Id: 1705,
        Sender_Id: 101,
        Receiver_Id: 108,
        Content: "Vikram, please check the Docker deployment configuration on the AWS staging cluster.",
        Timestamp: new Date("2024-03-14T14:20:00Z"),
        Is_Read: true
      },
      {
        Message_Id: 1706,
        Sender_Id: 108,
        Receiver_Id: 101,
        Content: "Staging deployment passed all automated CI/CD pipeline tests with 100% uptime!",
        Timestamp: new Date("2024-03-14T14:50:00Z"),
        Is_Read: true
      }
    ];

    // ==========================================
    // 18. Notification (6 Entities)
    // ==========================================
    const notifications = [
      {
        Notification_Id: 1801,
        User_Id: 102,
        Title: "Escrow Payment Released",
        Message: "₹1,000 has been released from escrow for completing Milestone 1.",
        Is_Read: false
      },
      {
        Notification_Id: 1802,
        User_Id: 101,
        Title: "Proposal Received",
        Message: "Rajesh Kumar submitted a proposal for Multilingual AI Chatbot project.",
        Is_Read: true
      },
      {
        Notification_Id: 1803,
        User_Id: 107,
        Title: "Milestone Approved",
        Message: "Fintech wireframe milestone approved by client Ananya Sharma.",
        Is_Read: false
      },
      {
        Notification_Id: 1804,
        User_Id: 106,
        Title: "Invoice Generated",
        Message: "Invoice #INV-2024-003 generated for Milestone 1 payment.",
        Is_Read: true
      },
      {
        Notification_Id: 1805,
        User_Id: 108,
        Title: "Skill Badge Awarded",
        Message: "Kubernetes & DevOps Verified Specialist badge added to your profile.",
        Is_Read: false
      },
      {
        Notification_Id: 1806,
        User_Id: 105,
        Title: "System Health Audit Passed",
        Message: "Platform escrow vault integrity audit passed with 0 discrepancies.",
        Is_Read: true
      }
    ];

    // Final mapping of all 18 tables with 6+ entities each
    const tableMapping = [
      { name: 'User', data: users },
      { name: 'Client', data: clients },
      { name: 'Freelancer', data: freelancers },
      { name: 'Project', data: projects },
      { name: 'Proposal', data: proposals },
      { name: 'Team', data: teams },
      { name: 'TeamMember', data: teamMembers },
      { name: 'Milestone', data: milestones },
      { name: 'EscrowPayment', data: escrowPayments },
      { name: 'Payment', data: payments },
      { name: 'Transaction', data: transactions },
      { name: 'Portfolio', data: portfolios },
      { name: 'PortfolioVerification', data: portfolioVerifications },
      { name: 'Certificate', data: certificates },
      { name: 'CertificateWallet', data: certificateWallets },
      { name: 'SkillVerification', data: skillVerifications },
      { name: 'Message', data: messages },
      { name: 'Notification', data: notifications },
    ];

    console.log('\n🚀 Populating ALL 18 tables with 6+ records each into MongoDB Atlas...');

    for (const table of tableMapping) {
      const col = db.collection(table.name);
      await col.deleteMany({});
      await col.insertMany(table.data);
      console.log(`✅ ${table.name} populated with ${table.data.length} records`);
    }

    console.log('\n🎉 ALL 18 TABLES NOW HAVE 6+ DETAILED RECORDS READY FOR YOUR REPORT!');

    await mongoose.disconnect();
    console.log('🔌 Connection closed.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

if (require.main === module) {
  seedAllTablesWithRichData();
}

module.exports = seedAllTablesWithRichData;
