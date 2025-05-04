"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  BriefcaseIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Home", href: "/home", icon: HomeIcon },
  { name: "Resume Optimizer", href: "/resume-optimizer", icon: DocumentTextIcon },
  { name: "LinkedIn Optimizer", href: "/linkedin-optimizer", icon: BriefcaseIcon },
  { name: "Cover Letter", href: "/cover-letter", icon: DocumentTextIcon },
  { name: "Interview Prep", href: "/interview-prep", icon: UserCircleIcon },
];

interface SidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    auth.signOut();
    router.push('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg lg:hidden"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 flex flex-col transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Logo/Brand Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {!isCollapsed && <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">CVSwitch</h1>}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
        
        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {mounted && theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
              {!isCollapsed && <span>{mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>

            {!isCollapsed && (
              <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 px-3">
                  <p>© {new Date().getFullYear()} CVSwitch</p>
                  <p>All rights reserved</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}