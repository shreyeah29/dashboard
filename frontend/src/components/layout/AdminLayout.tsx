import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Bell,
  Bot,
  Search
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Auto logout after 1 hour of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive",
        });
      }, 60 * 60 * 1000); // 1 hour
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [logout, toast]);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Companies', href: '/admin/companies', icon: Building2 },
    { name: 'Projects', href: '/admin/projects', icon: FileText },
    { name: 'Company KYC', href: '/admin/documents', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    // Simulate AI response
    const responses = [
      "To upload a document, go to Projects > Manage Files.",
      "View company analytics by clicking Profile on any company card.",
      "Project management is available in the Projects tab.",
      "Settings can be configured in the Settings page.",
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    toast({
      title: "Edicius AI Assistant",
      description: response,
    });
    
    setAiQuery('');
    setShowAiPanel(false);
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-2xl border-r border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <Logo width={120} height={40} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gray-100 text-black border-r-2 border-black shadow-lg font-semibold tracking-wide'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-black font-medium tracking-wide'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* AI Assistant */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 tracking-wide"
            >
              <Bot className="w-5 h-5" />
              <span>Ask Edicius AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-2xl">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <Logo width={120} height={40} />
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gray-100 text-black border-r-2 border-black shadow-lg font-semibold tracking-wide'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-black font-medium tracking-wide'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* AI Assistant */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 tracking-wide"
            >
              <Bot className="w-5 h-5" />
              <span>Ask Edicius AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-black lg:hidden transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-black tracking-wide">{user?.email || 'Admin User'}</p>
                <p className="text-xs text-gray-500 font-medium">Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-black transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant Panel */}
      {showAiPanel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-black" />
                <h3 className="text-black font-semibold tracking-wide">Edicius AI Assistant</h3>
              </div>
              <button
                onClick={() => setShowAiPanel(false)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <form onSubmit={handleAiQuery} className="p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AdminLayout;