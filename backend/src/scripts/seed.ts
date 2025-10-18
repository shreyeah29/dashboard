import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Company } from '../models/Company';
import { Project } from '../models/Project';
import { Document } from '../models/Document';
import { Comment } from '../models/Comment';

dotenv.config();

const companiesData = [
  {
    name: "Edicius Consumer Products",
    overview: "Edicius Consumer Products leads the innovation in smart consumer goods, personal care, and lifestyle solutions. We combine cutting-edge technology with user-centric design to create products that enhance daily life. Our portfolio spans smart home devices, premium personal care items, and innovative lifestyle accessories that redefine modern living standards.",
    missionStatement: "To revolutionize consumer experiences through intelligent design and innovative technology that seamlessly integrates into everyday life.",
    tagline: "Smart Living, Simplified",
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    colorPalette: {
      primary: "#1E40AF",
      secondary: "#3B82F6", 
      accent: "#F59E0B"
    }
  },
  {
    name: "Edicius Infrastructure and Developers",
    overview: "Edicius Infrastructure and Developers specializes in creating sustainable, smart infrastructure solutions for modern cities. We design and develop eco-friendly construction projects, smart buildings, and integrated urban planning solutions. Our expertise lies in combining environmental responsibility with technological innovation to build the infrastructure of tomorrow.",
    missionStatement: "Building sustainable, intelligent infrastructure that shapes the future of urban living while preserving our planet for generations to come.",
    tagline: "Building Tomorrow Today",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    colorPalette: {
      primary: "#059669",
      secondary: "#10B981",
      accent: "#F59E0B"
    }
  },
  {
    name: "Edicius Mining and Minerals",
    overview: "Edicius Mining and Minerals operates with a commitment to ethical resource extraction and environmental stewardship. We employ advanced mining technologies and sustainable practices to optimize mineral recovery while minimizing environmental impact. Our operations focus on responsible mining that supports local communities and global supply chains.",
    missionStatement: "Extracting Earth's resources responsibly through innovative technology and sustainable practices that benefit communities and preserve our environment.",
    tagline: "Mining with Purpose",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    colorPalette: {
      primary: "#7C2D12",
      secondary: "#EA580C",
      accent: "#F59E0B"
    }
  },
  {
    name: "Edicius Hotels and Hospitality",
    overview: "Edicius Hotels and Hospitality creates exceptional travel experiences through luxury accommodations, sustainable tourism practices, and authentic cultural immersion. We operate premium hotels and resorts that blend modern comfort with local heritage, offering guests unforgettable stays while supporting local communities and environmental conservation.",
    missionStatement: "Creating extraordinary hospitality experiences that celebrate local culture, promote sustainable tourism, and leave lasting positive impacts on destinations and communities.",
    tagline: "Where Luxury Meets Legacy",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    colorPalette: {
      primary: "#7C3AED",
      secondary: "#A855F7",
      accent: "#F59E0B"
    }
  },
  {
    name: "Edicius Enterprises",
    overview: "Edicius Enterprises serves as our multi-sector B2B venture arm, focusing on industrial innovation and strategic business partnerships. We develop and manufacture industrial goods, provide enterprise solutions, and create value through cross-industry collaborations. Our diverse portfolio spans manufacturing, technology integration, and business process optimization.",
    missionStatement: "Driving industrial innovation and creating strategic partnerships that deliver exceptional value across multiple sectors and markets.",
    tagline: "Industrial Innovation Partners",
    heroImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    colorPalette: {
      primary: "#374151",
      secondary: "#6B7280",
      accent: "#F59E0B"
    }
  },
  {
    name: "Edicius Imports and Exports",
    overview: "Edicius Imports and Exports facilitates seamless global commerce through advanced logistics, supply chain optimization, and international trade solutions. We connect markets worldwide, ensuring efficient movement of goods while maintaining quality standards and regulatory compliance. Our expertise spans multiple industries and geographic regions.",
    missionStatement: "Bridging global markets through innovative logistics solutions and strategic trade partnerships that enable seamless international commerce.",
    tagline: "Connecting Global Markets",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    colorPalette: {
      primary: "#0F766E",
      secondary: "#14B8A6",
      accent: "#F59E0B"
    }
  },
  {
    name: "Edicius Innovations and Consulting",
    overview: "Edicius Innovations and Consulting drives digital transformation through cutting-edge technology solutions, AI implementation, and strategic consulting services. We help organizations leverage emerging technologies to optimize operations, enhance customer experiences, and achieve sustainable growth. Our team combines technical expertise with business acumen to deliver measurable results.",
    missionStatement: "Empowering organizations to thrive in the digital age through innovative technology solutions, AI-driven insights, and strategic transformation consulting.",
    tagline: "Digital Transformation Leaders",
    heroImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    colorPalette: {
      primary: "#1E3A8A",
      secondary: "#3B82F6",
      accent: "#F59E0B"
    }
  },
  {
    name: "Edicius Productions and Entertainment",
    overview: "Edicius Productions and Entertainment creates compelling digital content, film productions, and immersive brand experiences that captivate audiences worldwide. We specialize in creative storytelling, digital media production, and innovative entertainment solutions that engage, inspire, and entertain across multiple platforms and formats.",
    missionStatement: "Creating extraordinary entertainment experiences and compelling digital content that inspire, engage, and connect audiences across the globe.",
    tagline: "Stories That Inspire",
    heroImage: "https://images.unsplash.com/photo-1489599804151-4b0b2b2b2b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    colorPalette: {
      primary: "#BE185D",
      secondary: "#EC4899",
      accent: "#F59E0B"
    }
  }
];

const sampleProjects = [
  {
    title: "Smart Home Ecosystem",
    description: "A comprehensive smart home solution integrating IoT devices, AI-powered automation, and energy management systems. This project revolutionizes how families interact with their living spaces through intelligent design and seamless connectivity.",
    status: "In Progress" as const,
    team: [
      { name: "Sarah Chen", role: "Product Manager", avatar: "" },
      { name: "Michael Rodriguez", role: "Lead Engineer", avatar: "" },
      { name: "Emily Watson", role: "UX Designer", avatar: "" }
    ],
    milestones: [
      { title: "Market Research Complete", date: new Date("2024-01-15"), note: "Comprehensive analysis of smart home trends" },
      { title: "Prototype Development", date: new Date("2024-03-20"), note: "First working prototype with core features" },
      { title: "Beta Testing", date: new Date("2024-06-01"), note: "Limited beta release with 100 households" },
      { title: "Commercial Launch", date: new Date("2024-09-15"), note: "Full market release planned" }
    ]
  },
  {
    title: "Green Building Initiative",
    description: "Sustainable construction project featuring LEED-certified buildings with integrated renewable energy systems, smart water management, and eco-friendly materials. This initiative sets new standards for environmentally conscious urban development.",
    status: "Planned" as const,
    team: [
      { name: "David Kumar", role: "Project Director", avatar: "" },
      { name: "Lisa Thompson", role: "Sustainability Engineer", avatar: "" },
      { name: "James Wilson", role: "Architect", avatar: "" }
    ],
    milestones: [
      { title: "Site Preparation", date: new Date("2024-02-01"), note: "Environmental assessment and site clearing" },
      { title: "Foundation Work", date: new Date("2024-04-15"), note: "Sustainable foundation with recycled materials" },
      { title: "Structure Completion", date: new Date("2024-08-30"), note: "Main building structure with green features" },
      { title: "Final Certification", date: new Date("2024-12-15"), note: "LEED Platinum certification target" }
    ]
  },
  {
    title: "Digital Transformation Platform",
    description: "Comprehensive digital transformation solution helping enterprises migrate to cloud-based systems, implement AI-driven analytics, and optimize business processes. This platform accelerates digital adoption across various industries.",
    status: "Completed" as const,
    team: [
      { name: "Alex Johnson", role: "Technical Lead", avatar: "" },
      { name: "Maria Garcia", role: "Data Scientist", avatar: "" },
      { name: "Robert Kim", role: "Solutions Architect", avatar: "" }
    ],
    milestones: [
      { title: "Platform Architecture", date: new Date("2023-09-01"), note: "Core platform design and architecture" },
      { title: "MVP Development", date: new Date("2023-12-15"), note: "Minimum viable product with key features" },
      { title: "Client Pilot", date: new Date("2024-02-28"), note: "Successful pilot with 5 enterprise clients" },
      { title: "Full Launch", date: new Date("2024-05-30"), note: "Platform officially launched and operational" }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Company.deleteMany({});
    await Project.deleteMany({});
    await Document.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create companies
    const companies = await Company.insertMany(companiesData);
    console.log(`Created ${companies.length} companies`);

    // Create sample projects for each company
    const projects = [];
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      const projectData = sampleProjects[i % sampleProjects.length];
      
      const project = new Project({
        companyId: company._id,
        ...projectData
      });
      
      await project.save();
      projects.push(project);
    }
    console.log(`Created ${projects.length} projects`);

    // Create sample comments
    const comments = [];
    for (const project of projects) {
      const comment = new Comment({
        projectId: project._id,
        author: 'admin',
        text: `Project "${project.title}" has been successfully initialized. All team members have been briefed and initial milestones are being tracked.`
      });
      await comment.save();
      comments.push(comment);
    }
    console.log(`Created ${comments.length} comments`);

    console.log('Database seeded successfully!');
    console.log('\nSample data created:');
    console.log(`- ${companies.length} companies`);
    console.log(`- ${projects.length} projects`);
    console.log(`- ${comments.length} comments`);
    
    if (process.env.SAMPLE_SEED === 'true') {
      console.log('\nNote: SAMPLE_SEED is enabled. You can upload sample documents through the admin panel.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
