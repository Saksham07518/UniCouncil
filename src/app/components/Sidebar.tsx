import React from 'react';
import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Users, Vote, BarChart3, User, LogOut, MessageCircle, Brain } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Menu, X, Home, Settings } from 'lucide-react';
const logo = '/logo.png';

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const studentNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/quiz', label: 'Find Right Candidate', icon: Brain },
    { path: '/candidates', label: 'Candidates', icon: Users },
    { path: '/vote', label: 'Vote', icon: Vote },
    { path: '/results', label: 'Results', icon: BarChart3 },
    { path: '/qa', label: 'Q&A', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/profile', label: 'Profile', icon: User },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <ImageWithFallback
              src={logo}
              alt="UniCouncil Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-sidebar-foreground leading-tight">UniCouncil</h3>
            <p className="text-xs text-muted-foreground">Election Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}