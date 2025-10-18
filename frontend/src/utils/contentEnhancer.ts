export interface EnhancedProjectContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  overview: {
    summary: string;
    keyPoints: string[];
  };
  features: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  technology: {
    title: string;
    stack: string[];
  };
  benefits: {
    title: string;
    items: string[];
  };
  gallery: {
    title: string;
    images: Array<{
      src: string;
      alt: string;
      caption: string;
    }>;
  };
}

// Professional stock images for different project types
const PROJECT_IMAGES = {
  legal: [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ],
  tech: [
    'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ]
};

// Icon mapping for different features
const FEATURE_ICONS = {
  'chat': '💬',
  'security': '🔒',
  'ai': '🤖',
  'payment': '💳',
  'tracking': '📊',
  'diary': '📝',
  'infrastructure': '🏗️',
  'multilingual': '🌐',
  'real-time': '⚡',
  'cloud': '☁️',
  'mobile': '📱',
  'web': '🌐',
  'api': '🔌',
  'database': '🗄️',
  'analytics': '📈',
  'automation': '⚙️',
  'integration': '🔗',
  'scalable': '📈',
  'modern': '✨',
  'cutting-edge': '🚀'
};

export function enhanceProjectContent(projectName: string, description: string): EnhancedProjectContent {
  const lowerName = projectName.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  // Determine project type and select appropriate images
  let imageSet = PROJECT_IMAGES.default;
  if (lowerName.includes('legal') || lowerDesc.includes('legal') || lowerDesc.includes('advocate')) {
    imageSet = PROJECT_IMAGES.legal;
  } else if (lowerDesc.includes('tech') || lowerDesc.includes('digital') || lowerDesc.includes('ai')) {
    imageSet = PROJECT_IMAGES.tech;
  } else if (lowerDesc.includes('business') || lowerDesc.includes('consulting')) {
    imageSet = PROJECT_IMAGES.business;
  }

  // Extract key features from description
  const features = extractFeatures(description);
  
  // Extract technology stack
  const techStack = extractTechnology(description);
  
  // Extract benefits
  const benefits = extractBenefits(description);
  
  // Create enhanced content
  return {
    hero: {
      title: projectName,
      subtitle: generateSubtitle(description),
      backgroundImage: imageSet[0]
    },
    overview: {
      summary: generateSummary(description),
      keyPoints: extractKeyPoints(description)
    },
    features: {
      title: 'Key Features & Capabilities',
      items: features
    },
    technology: {
      title: 'Technology Stack',
      stack: techStack
    },
    benefits: {
      title: 'Project Benefits',
      items: benefits
    },
    gallery: {
      title: 'Project Gallery',
      images: imageSet.map((src, index) => ({
        src,
        alt: `${projectName} - Image ${index + 1}`,
        caption: generateImageCaption(projectName, index)
      }))
    }
  };
}

function extractFeatures(description: string): Array<{ icon: string; title: string; description: string }> {
  const features: Array<{ icon: string; title: string; description: string }> = [];
  const lowerDesc = description.toLowerCase();
  
  // Define feature patterns
  const featurePatterns = [
    {
      keywords: ['chat', 'communication', 'messaging'],
      icon: FEATURE_ICONS.chat,
      title: 'Real-time Communication',
      description: 'Advanced messaging and communication system'
    },
    {
      keywords: ['secure', 'security', 'encryption', 'protected'],
      icon: FEATURE_ICONS.security,
      title: 'Enterprise Security',
      description: 'Bank-grade security and data protection'
    },
    {
      keywords: ['ai', 'artificial intelligence', 'intelligent', 'smart'],
      icon: FEATURE_ICONS.ai,
      title: 'AI-Powered Features',
      description: 'Intelligent automation and smart assistance'
    },
    {
      keywords: ['payment', 'settlement', 'transaction', 'cashfree'],
      icon: FEATURE_ICONS.payment,
      title: 'Instant Payments',
      description: 'Seamless payment processing and settlements'
    },
    {
      keywords: ['tracking', 'monitor', 'progress', 'analytics'],
      icon: FEATURE_ICONS.tracking,
      title: 'Progress Tracking',
      description: 'Real-time monitoring and analytics dashboard'
    },
    {
      keywords: ['diary', 'notes', 'updates', 'schedule'],
      icon: FEATURE_ICONS.diary,
      title: 'Smart Diary System',
      description: 'Intelligent scheduling and note management'
    },
    {
      keywords: ['multilingual', 'language', 'global', 'international'],
      icon: FEATURE_ICONS.multilingual,
      title: 'Multilingual Support',
      description: 'Global accessibility with multiple languages'
    },
    {
      keywords: ['cloud', 'storage', 'document', 'file'],
      icon: FEATURE_ICONS.cloud,
      title: 'Cloud Storage',
      description: 'Secure document storage and management'
    },
    {
      keywords: ['scalable', 'scaling', 'infrastructure'],
      icon: FEATURE_ICONS.scalable,
      title: 'Scalable Infrastructure',
      description: 'Built to handle growth and high demand'
    },
    {
      keywords: ['modern', 'cutting-edge', 'advanced', 'next-generation'],
      icon: FEATURE_ICONS.modern,
      title: 'Modern Technology',
      description: 'Latest technologies and best practices'
    }
  ];

  // Check for each feature pattern
  featurePatterns.forEach(pattern => {
    if (pattern.keywords.some(keyword => lowerDesc.includes(keyword))) {
      features.push({
        icon: pattern.icon,
        title: pattern.title,
        description: pattern.description
      });
    }
  });

  // If no features found, add some default ones based on project type
  if (features.length === 0) {
    features.push(
      {
        icon: FEATURE_ICONS.modern,
        title: 'Modern Design',
        description: 'Contemporary and user-friendly interface'
      },
      {
        icon: FEATURE_ICONS.scalable,
        title: 'Scalable Solution',
        description: 'Built to grow with your business needs'
      },
      {
        icon: FEATURE_ICONS.security,
        title: 'Secure Platform',
        description: 'Enterprise-grade security and data protection'
      }
    );
  }

  return features.slice(0, 6); // Limit to 6 features
}

function extractTechnology(description: string): string[] {
  const lowerDesc = description.toLowerCase();
  const techStack: string[] = [];
  
  // Technology patterns
  const techPatterns = [
    { keywords: ['react', 'javascript', 'js'], name: 'React.js' },
    { keywords: ['node', 'nodejs', 'express'], name: 'Node.js' },
    { keywords: ['mongodb', 'mongo', 'database'], name: 'MongoDB' },
    { keywords: ['typescript', 'ts'], name: 'TypeScript' },
    { keywords: ['aws', 'amazon web services'], name: 'AWS' },
    { keywords: ['docker', 'container'], name: 'Docker' },
    { keywords: ['kubernetes', 'k8s'], name: 'Kubernetes' },
    { keywords: ['redis', 'cache'], name: 'Redis' },
    { keywords: ['postgresql', 'postgres'], name: 'PostgreSQL' },
    { keywords: ['python', 'django', 'flask'], name: 'Python' },
    { keywords: ['java', 'spring'], name: 'Java' },
    { keywords: ['php', 'laravel'], name: 'PHP' },
    { keywords: ['angular'], name: 'Angular' },
    { keywords: ['vue', 'vuejs'], name: 'Vue.js' },
    { keywords: ['nextjs', 'next.js'], name: 'Next.js' },
    { keywords: ['tailwind', 'css'], name: 'Tailwind CSS' },
    { keywords: ['graphql'], name: 'GraphQL' },
    { keywords: ['rest', 'api'], name: 'REST API' },
    { keywords: ['microservices'], name: 'Microservices' },
    { keywords: ['ai', 'machine learning', 'ml'], name: 'AI/ML' }
  ];

  techPatterns.forEach(pattern => {
    if (pattern.keywords.some(keyword => lowerDesc.includes(keyword))) {
      techStack.push(pattern.name);
    }
  });

  // If no specific tech found, add some defaults
  if (techStack.length === 0) {
    techStack.push('Modern Web Technologies', 'Cloud Infrastructure', 'Database Systems', 'API Integration');
  }

  return techStack.slice(0, 8); // Limit to 8 technologies
}

function extractBenefits(description: string): string[] {
  const lowerDesc = description.toLowerCase();
  const benefits: string[] = [];
  
  // Benefit patterns
  const benefitPatterns = [
    'Improved efficiency and productivity',
    'Enhanced user experience and satisfaction',
    'Reduced operational costs and time',
    'Better data security and compliance',
    'Scalable and flexible solution',
    'Real-time insights and analytics',
    'Streamlined workflow and processes',
    'Increased customer engagement',
    'Better decision making capabilities',
    'Competitive advantage in market'
  ];

  // Add benefits based on description content
  if (lowerDesc.includes('efficiency') || lowerDesc.includes('productivity')) {
    benefits.push('Improved efficiency and productivity');
  }
  if (lowerDesc.includes('user') || lowerDesc.includes('experience')) {
    benefits.push('Enhanced user experience and satisfaction');
  }
  if (lowerDesc.includes('cost') || lowerDesc.includes('time')) {
    benefits.push('Reduced operational costs and time');
  }
  if (lowerDesc.includes('security') || lowerDesc.includes('secure')) {
    benefits.push('Better data security and compliance');
  }
  if (lowerDesc.includes('scalable') || lowerDesc.includes('flexible')) {
    benefits.push('Scalable and flexible solution');
  }
  if (lowerDesc.includes('analytics') || lowerDesc.includes('insights')) {
    benefits.push('Real-time insights and analytics');
  }
  if (lowerDesc.includes('workflow') || lowerDesc.includes('process')) {
    benefits.push('Streamlined workflow and processes');
  }
  if (lowerDesc.includes('customer') || lowerDesc.includes('engagement')) {
    benefits.push('Increased customer engagement');
  }

  // If no specific benefits found, add some defaults
  if (benefits.length === 0) {
    benefits.push(
      'Improved efficiency and productivity',
      'Enhanced user experience and satisfaction',
      'Better data security and compliance',
      'Scalable and flexible solution'
    );
  }

  return benefits.slice(0, 6); // Limit to 6 benefits
}

function extractKeyPoints(description: string): string[] {
  // Extract key sentences from description
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 3).map(s => s.trim());
}

function generateSubtitle(description: string): string {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('legal') || lowerDesc.includes('advocate')) {
    return 'Revolutionizing Legal Services with Technology';
  } else if (lowerDesc.includes('ai') || lowerDesc.includes('artificial intelligence')) {
    return 'AI-Powered Digital Transformation Platform';
  } else if (lowerDesc.includes('business') || lowerDesc.includes('consulting')) {
    return 'Strategic Business Solutions & Consulting';
  } else if (lowerDesc.includes('tech') || lowerDesc.includes('digital')) {
    return 'Cutting-Edge Technology Solutions';
  } else {
    return 'Innovative Digital Platform & Solutions';
  }
}

function generateSummary(description: string): string {
  // Take first 2-3 sentences as summary
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 2).join('. ').trim() + '.';
}

function generateImageCaption(projectName: string, index: number): string {
  const captions = [
    `${projectName} - Modern Interface Design`,
    `${projectName} - Advanced Technology Stack`,
    `${projectName} - Professional Implementation`
  ];
  return captions[index] || `${projectName} - Project Overview`;
}
