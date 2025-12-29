import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { companiesApi, projectsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Building2, Calendar, Users, ArrowRight, Globe, CheckCircle, Clock,
  Rocket, Briefcase, Bot, Hammer, Leaf, FlaskConical,
  Film, Smartphone, PartyPopper, Users2, TrendingUp, Target,
  Truck, Ship, Globe2, Wrench, HardHat, MapPin,
  Bed, UtensilsCrossed, Home, Building, Zap
} from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

// Function to get appropriate hero image based on company name
const getCompanyHeroImage = (companyName: string) => {
  const name = companyName.toLowerCase();
  
  if (name.includes('innovations') || name.includes('consulting')) {
    return 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Technology/Consulting
  } else if (name.includes('mining') || name.includes('minerals')) {
    return 'https://static.vecteezy.com/system/resources/previews/046/249/257/large_2x/mining-work-background-free-photo.jpg'; // Mining Work Background
  } else if (name.includes('productions') || name.includes('entertainment')) {
    return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Film Production/Cinema
  } else if (name.includes('enterprises')) {
    return 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Mining/Industrial (using old mining image)
  } else if (name.includes('infrastructure') || name.includes('developers')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Construction/Infrastructure
  } else if (name.includes('imports') || name.includes('exports')) {
    return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Trade/Logistics
  } else if (name.includes('consumer') || name.includes('products')) {
    return 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Consumer Products
  } else if (name.includes('hotels') || name.includes('hospitality')) {
    return 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Hotels/Hospitality
  } else if (name.includes('real estate')) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Real Estate
  } else {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80'; // Default business
  }
};

// Function to get feature images for company sections
const getCompanyFeatureImage = (companyName: string) => {
  const name = companyName.toLowerCase();
  
  if (name.includes('innovations') || name.includes('consulting')) {
    return 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Technology/Consulting
  } else if (name.includes('mining') || name.includes('minerals')) {
    return 'https://static.vecteezy.com/system/resources/previews/046/249/257/large_2x/mining-work-background-free-photo.jpg'; // Mining Work Background
  } else if (name.includes('productions') || name.includes('entertainment')) {
    return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Film Production/Cinema
  } else if (name.includes('enterprises')) {
    return 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Mining/Industrial (using old mining image)
  } else if (name.includes('infrastructure') || name.includes('developers')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Infrastructure/Construction
  } else if (name.includes('imports') || name.includes('exports')) {
    return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Trade/Logistics
  } else if (name.includes('consumer') || name.includes('products')) {
    return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Consumer Products
  } else if (name.includes('hotels') || name.includes('hospitality')) {
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Hospitality
  } else {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Default business
  }
};

// Function to get company-specific content
const getCompanyContent = (companyName: string) => {
  const name = companyName.toLowerCase();
  
  if (name.includes('innovations') || name.includes('consulting')) {
    return {
      mission: "Transforming businesses through innovative technology solutions and strategic consulting expertise.",
      services: [
        {
          title: "Digital Transformation",
          description: "Comprehensive digital transformation strategies that modernize operations and drive growth.",
          icon: Rocket
        },
        {
          title: "Technology Consulting",
          description: "Expert guidance on technology adoption, system integration, and digital strategy.",
          icon: Briefcase
        },
        {
          title: "AI & Automation",
          description: "Cutting-edge artificial intelligence solutions and process automation services.",
          icon: Bot
        }
      ],
      highlights: [
        "Leading digital transformation initiatives for Fortune 500 companies",
        "Expert team of certified technology consultants and solution architects",
        "Proven track record of successful technology implementations",
        "24/7 support and maintenance services"
      ]
    };
  } else if (name.includes('mining') || name.includes('minerals')) {
    return {
      mission: "Responsible resource extraction with cutting-edge technology and environmental stewardship.",
      services: [
        {
          title: "Mining Operations",
          description: "Advanced mining technologies and sustainable extraction methods for various minerals.",
          icon: Hammer
        },
        {
          title: "Environmental Management",
          description: "Comprehensive environmental impact assessment and sustainable mining practices.",
          icon: Leaf
        },
        {
          title: "Mineral Processing",
          description: "State-of-the-art processing facilities and quality control systems.",
          icon: FlaskConical
        }
      ],
      highlights: [
        "ISO 14001 certified environmental management systems",
        "Advanced safety protocols with zero-accident record",
        "Sustainable mining practices with minimal environmental impact",
        "High-grade mineral extraction with 95% efficiency"
      ]
    };
  } else if (name.includes('productions') || name.includes('entertainment')) {
    return {
      mission: "Creating compelling digital content and immersive entertainment experiences that captivate audiences worldwide.",
      services: [
        {
          title: "Film Production",
          description: "Full-service film production from concept to distribution with state-of-the-art equipment.",
          icon: Film
        },
        {
          title: "Digital Content",
          description: "Creative digital content creation for brands, social media, and marketing campaigns.",
          icon: Smartphone
        },
        {
          title: "Event Management",
          description: "Large-scale event planning and execution for corporate and entertainment events.",
          icon: PartyPopper
        }
      ],
      highlights: [
        "Award-winning production team with international recognition",
        "State-of-the-art studios and post-production facilities",
        "Creative partnerships with leading brands and artists",
        "Global distribution network for content delivery"
      ]
    };
  } else if (name.includes('enterprises')) {
    return {
      mission: "Multi-sector business ventures driving innovation across diverse industries with strategic partnerships.",
      services: [
        {
          title: "HappyCabs",
          description: "Leading transportation solutions with a focus on customer service and reliability.",
          icon: Truck
        },
        {
          title: "L.A.D.S",
          description: "Innovative business solutions and strategic partnerships for growth.",
          icon: Briefcase
        },
        {
          title: "Flyaway Consultancy",
          description: "Expert consulting services for business expansion and strategic planning.",
          icon: Rocket
        }
      ],
      highlights: [
        "Diversified portfolio across 8+ industry sectors",
        "Strategic partnerships with leading global companies",
        "Proven track record of successful business ventures",
        "Expert team of business strategists and analysts"
      ]
    };
  } else if (name.includes('infrastructure') || name.includes('developers')) {
    return {
      mission: "Building sustainable, smart infrastructure solutions for modern cities and eco-friendly development.",
      services: [
        {
          title: "Smart Infrastructure",
          description: "Intelligent infrastructure solutions with IoT integration and smart city technologies.",
          icon: Building
        },
        {
          title: "Sustainable Construction",
          description: "Eco-friendly construction methods and green building certifications.",
          icon: Leaf
        },
        {
          title: "Urban Planning",
          description: "Comprehensive urban planning and development strategies for modern cities.",
          icon: MapPin
        }
      ],
      highlights: [
        "LEED certified sustainable construction practices",
        "Smart city technology integration and IoT solutions",
        "Award-winning infrastructure projects",
        "Expert team of civil engineers and urban planners"
      ]
    };
  } else if (name.includes('imports') || name.includes('exports')) {
    return {
      mission: "Facilitating seamless global commerce through advanced logistics and international trade solutions.",
      services: [
        {
          title: "Global Trade",
          description: "Comprehensive import/export services with worldwide logistics network.",
          icon: Globe2
        },
        {
          title: "Supply Chain Management",
          description: "End-to-end supply chain optimization and logistics management.",
          icon: Truck
        },
        {
          title: "Customs & Compliance",
          description: "Expert customs clearance and international trade compliance services.",
          icon: Ship
        }
      ],
      highlights: [
        "Global network spanning 50+ countries",
        "Advanced logistics technology and tracking systems",
        "Expert customs and compliance team",
        "24/7 customer support and real-time shipment tracking"
      ]
    };
  } else if (name.includes('consumer') || name.includes('products')) {
    return {
      mission: "Innovative consumer products and lifestyle solutions that enhance daily living with smart technology.",
      services: [
        {
          title: "Smart Consumer Goods",
          description: "Technology-integrated consumer products for modern lifestyle needs.",
          icon: Home
        },
        {
          title: "Personal Care",
          description: "Premium personal care products with natural and organic ingredients.",
          icon: Zap
        },
        {
          title: "Lifestyle Solutions",
          description: "Innovative lifestyle products that simplify and enhance daily routines.",
          icon: Wrench
        }
      ],
      highlights: [
        "Innovation-driven product development and design",
        "Quality assurance with international certifications",
        "Sustainable and eco-friendly product lines",
        "Global distribution network and retail partnerships"
      ]
    };
  } else if (name.includes('hotels') || name.includes('hospitality')) {
    return {
      mission: "Creating exceptional travel experiences through luxury accommodations and sustainable tourism practices.",
      services: [
        {
          title: "Luxury Accommodations",
          description: "Premium hotel and resort experiences with world-class amenities and service.",
          icon: Bed
        },
        {
          title: "Sustainable Tourism",
          description: "Eco-friendly tourism practices and sustainable hospitality solutions.",
          icon: Leaf
        },
        {
          title: "Event Venues",
          description: "Exclusive event venues and conference facilities for corporate and social events.",
          icon: PartyPopper
        }
      ],
      highlights: [
        "5-star luxury accommodations with premium amenities",
        "Sustainable tourism practices and environmental responsibility",
        "Award-winning hospitality and guest services",
        "Prime locations in major business and tourist destinations"
      ]
    };
  } else {
    return {
      mission: "Delivering innovative solutions and exceptional value across diverse business sectors.",
      services: [
        {
          title: "Business Solutions",
          description: "Comprehensive business solutions tailored to specific industry needs.",
          icon: Briefcase
        },
        {
          title: "Innovation & Technology",
          description: "Cutting-edge technology solutions and innovation consulting services.",
          icon: Rocket
        },
        {
          title: "Strategic Partnerships",
          description: "Strategic partnerships and collaboration opportunities for growth.",
          icon: Users2
        }
      ],
      highlights: [
        "Multi-industry expertise and proven track record",
        "Innovation-driven approach to business solutions",
        "Expert team of professionals and consultants",
        "Commitment to excellence and customer satisfaction"
      ]
    };
  }
};

const CompanyPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['company', slug],
    queryFn: () => companiesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', slug],
    queryFn: () => projectsApi.getByCompanySlug(slug!),
    enabled: !!slug,
  });

  // Check if company should show only "Coming Soon" (Mining, Hotels, Consumer Products, Productions)
  const showComingSoonOnly = company && (
    company.name.toLowerCase().includes('mining') || 
    company.name.toLowerCase().includes('minerals') ||
    company.name.toLowerCase().includes('hotels') ||
    company.name.toLowerCase().includes('hospitality') ||
    company.name.toLowerCase().includes('consumer') ||
    company.name.toLowerCase().includes('products') ||
    company.name.toLowerCase().includes('productions') ||
    company.name.toLowerCase().includes('entertainment')
  );

  if (companyLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative ${showComingSoonOnly ? 'h-screen' : 'min-h-[80vh]'} flex items-center justify-center overflow-hidden`}>
        {/* Dynamic Background Image based on company */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${getCompanyHeroImage(company.name)})` 
            }}
          ></div>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            {showComingSoonOnly ? (
              // Coming Soon content overlaid on hero image - minimal design
              <div className="max-w-4xl mx-auto">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-8 font-serif tracking-tight"
                >
                  {company.name}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-100/90 to-orange-50/90 rounded-full border-2 border-orange-200/90 backdrop-blur-sm">
                    <span className="text-3xl font-bold text-orange-800 tracking-wide">Coming Soon 2027</span>
                  </div>
                </motion.div>
              </div>
            ) : (
              <>
                <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 mb-8 font-medium tracking-wide">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Companies
                </Link>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-serif tracking-tight">
                  {company.name}
                </h1>
                <p className="text-xl text-white/90 max-w-4xl mx-auto font-medium leading-relaxed">
                  {company.overview}
                </p>
                
                {/* Company Stats Overlay */}
                {(company.name.toLowerCase().includes('enterprises')) ? (
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-2">3</div>
                      <div className="text-white/80 font-medium">Active Brands</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-2">5+</div>
                      <div className="text-white/80 font-medium">Years Experience</div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-2">{projects?.length || 0}</div>
                      <div className="text-white/80 font-medium">Active Projects</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-2">5+</div>
                      <div className="text-white/80 font-medium">Years Experience</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                      <div className="text-3xl font-bold text-white mb-2">100+</div>
                      <div className="text-white/80 font-medium">Happy Clients</div>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Company Overview - Only show for non-Coming Soon companies */}
      {!showComingSoonOnly && (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-8 font-serif tracking-wide">
              About {company.name}
            </h2>
            {(company.name.toLowerCase().includes('enterprises')) ? (
              <div className="max-w-5xl mx-auto">
                <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                  Edicius Enterprises was started in 2020 and the business has developed multiple brands focusing on customer service through strategic business planning. Enterprises focuses on customer requirements through small investments into public sector.
                </p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                  {company.overview}
                </p>
              </div>
            )}
          </motion.div>

          {/* Visual Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src={getCompanyFeatureImage(company.name)}
                alt={`${company.name} operations`}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {(company.name.toLowerCase().includes('enterprises')) ? (
                <>
                  <h3 className="text-3xl font-bold text-black font-serif tracking-wide">
                    Strategic Business Excellence
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">
                    Edicius Enterprises is a multi-sector B2B venture arm that drives innovation across diverse industries through strategic partnerships and customer-centric approaches. We specialize in identifying growth opportunities and making strategic investments that create value for both our partners and the public sector.
                  </p>
                  
                  {/* Company Highlights */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Diversified portfolio across 8+ industry sectors</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Strategic partnerships with leading global companies</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Proven track record of successful business ventures</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Expert team of business strategists and analysts</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-black font-serif tracking-wide">
                    {getCompanyContent(company.name).mission}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed font-medium">
                    {company.overview}
                  </p>
                  
                  {/* Company Highlights */}
                  <div className="space-y-4">
                    {getCompanyContent(company.name).highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">{highlight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Company Services/Brands Section - Only show for non-Coming Soon companies */}
      {!showComingSoonOnly && (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">
              {(company.name.toLowerCase().includes('enterprises')) ? 'Our Brands' : 'Our Services'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              {getCompanyContent(company.name).mission}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getCompanyContent(company.name).services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border border-gray-200">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <service.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4 font-serif tracking-wide">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Projects Section - Only show for non-Coming Soon companies and not Enterprises */}
      {!showComingSoonOnly && !company.name.toLowerCase().includes('enterprises') && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">
                Our Projects
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                Explore the innovative projects and initiatives driving our success in digital transformation
              </p>
            </motion.div>

            {projects && projects.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {projects.map((project) => (
                  <motion.div key={project._id} variants={itemVariants}>
                    <Link to={`/project/${project.slug}`}>
                      <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-pointer border-0 shadow-lg bg-white border border-gray-200">
                        <div className="relative overflow-hidden rounded-t-xl">
                          {project.bannerImage ? (
                            <img
                              src={project.bannerImage}
                              alt={project.name}
                              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-56 bg-black flex items-center justify-center">
                              <Building2 className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <CardContent className="p-8">
                          <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-gray-600 transition-colors duration-200 font-serif tracking-wide">
                            {project.name}
                          </h3>
                          <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed font-medium">
                            {project.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
                              <Users className="w-4 h-4 mr-2 text-black" />
                              <span className="font-medium">{project.teamSize || 0} members</span>
                            </div>
                            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
                              <Calendar className="w-4 h-4 mr-2 text-black" />
                              <span className="font-medium">{formatDate(project.createdAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-lg font-semibold text-black group-hover:text-gray-600 transition-colors duration-200 tracking-wide">
                              View Project Details
                            </span>
                            <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-2 transition-transform duration-200" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center py-12"
              >
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2 font-serif tracking-wide">
                  No projects yet
                </h3>
                <p className="text-gray-500 font-medium">
                  Projects for this company will be displayed here once they are added.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default CompanyPage;
