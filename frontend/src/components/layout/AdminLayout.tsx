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
  BarChart3,
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
    { name: 'Documents', href: '/admin/documents', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
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
      "You can view analytics in the Analytics section.",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-gradient-to-b from-gray-900 to-black shadow-2xl border-r border-red-500/20">
          <div className="flex h-16 items-center justify-between px-4 border-b border-red-500/20">
            <Logo width={120} height={40} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
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
                    ? 'bg-red-600 text-white border-r-2 border-red-500 shadow-lg font-semibold tracking-wide'
                    : 'text-white/80 hover:bg-white/10 hover:text-white font-medium tracking-wide'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* AI Assistant */}
          <div className="p-4 border-t border-red-500/20">
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 tracking-wide"
            >
              <Bot className="w-5 h-5" />
              <span>Ask Edicius AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-gray-900 to-black border-r border-red-500/20 shadow-2xl">
          <div className="flex h-16 items-center px-4 border-b border-red-500/20">
            <Logo width={120} height={40} />
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-red-600 text-white border-r-2 border-red-500 shadow-lg font-semibold tracking-wide'
                    : 'text-white/80 hover:bg-white/10 hover:text-white font-medium tracking-wide'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* AI Assistant */}
          <div className="p-4 border-t border-red-500/20">
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 tracking-wide"
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
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-r from-gray-900 to-black border-b border-red-500/20 px-4 shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/80 hover:text-white lg:hidden transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="text-white/80 hover:text-white transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white tracking-wide">{user?.email || 'Admin User'}</p>
                <p className="text-xs text-white/60 font-medium">Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-white/80 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gradient-to-br from-gray-800 via-gray-900 to-black min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* AI Assistant Panel */}
      {showAiPanel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 w-80 bg-gradient-to-br from-gray-900 to-black border border-red-500/20 rounded-2xl shadow-2xl z-50"
        >
          <div className="p-4 border-b border-red-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-white" />
                <h3 className="text-white font-semibold tracking-wide">Edicius AI Assistant</h3>
              </div>
              <button
                onClick={() => setShowAiPanel(false)}
                className="text-white/80 hover:text-white"
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
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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