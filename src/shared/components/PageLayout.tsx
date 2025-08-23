"use client";

import { ReactNode } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { 
  Clock, 
  Search, 
  Filter, 
  Package,
  Users,
  BarChart3,
  Settings,
  FileText,
  ShoppingCart
} from "lucide-react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  stats?: Array<{
    title: string;
    value: string;
    change?: string;
    icon: any;
    color: string;
  }>;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  filters?: ReactNode;
  showRefresh?: boolean;
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}

export function PageLayout({
  title,
  subtitle,
  icon = <Package className="w-8 h-8" />,
  children,
  actions,
  stats,
  showSearch = false,
  searchPlaceholder = "Поиск...",
  onSearch,
  showFilters = false,
  filters,
  showRefresh = false,
  onRefresh,
  loading = false,
  className = ""
}: PageLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dynamic theme classes
  const bgMain = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const bgHeader = isDark ? 'bg-gray-900/50' : 'bg-white/90';
  const bgCard = isDark ? 'bg-gray-900/50' : 'bg-white';
  const bgCardHover = isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50';
  const bgInput = isDark ? 'bg-gray-800/50' : 'bg-gray-100';
  const bgFilter = isDark ? 'bg-gray-900/50' : 'bg-white';
  const textMain = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-500';
  const borderMain = isDark ? 'border-gray-800' : 'border-gray-200';
  const borderHover = isDark ? 'hover:border-gray-700' : 'hover:border-gray-300';

  return (
    <div className={`min-h-screen ${bgMain} ${textMain} ${className}`}>
      {/* Header */}
      <div className={`${bgHeader} border-b ${borderMain} sticky top-0 z-10 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'} rounded-xl border ${isDark ? 'border-blue-500/30' : 'border-blue-200'}`}>
                <div className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                  {icon}
                </div>
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${textMain}`}>{title}</h1>
                {subtitle && (
                  <p className={textSecondary}>
                    {subtitle}
                  </p>
                )}
                {/* Current time */}
                <div className={`text-xs ${textMuted} mt-1 flex items-center gap-1`}>
                  <Clock className="w-3 h-3" />
                  {new Date().toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {showRefresh && onRefresh && (
                <Button
                  onClick={onRefresh}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className={`${borderMain} ${textSecondary} ${borderHover}`}
                >
                  Обновить
                </Button>
              )}
              {actions}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className={`${bgCard} border ${borderMain} ${bgCardHover} transition-all duration-200`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${textSecondary}`}>
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${textMain}`}>{stat.value}</div>
                    {stat.change && (
                      <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} с прошлой недели
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`${bgFilter} rounded-2xl border ${borderMain} p-6 mb-8`}>
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {showSearch && (
                  <div className="flex items-center gap-3 flex-1 max-w-md">
                    <Search className={`w-5 h-5 ${textMuted}`} />
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      onChange={(e) => onSearch?.(e.target.value)}
                      className={`flex-1 px-4 py-3 ${bgInput} border ${borderMain} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ${textMain} placeholder-${textMuted}`}
                    />
                  </div>
                )}
                
                {showFilters && (
                  <div className="flex items-center gap-3">
                    <Filter className={`w-5 h-5 ${textMuted}`} />
                    {filters}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {children}
      </div>
    </div>
  );
}

// Quick action buttons component
export function QuickActionButton({
  icon,
  title,
  subtitle,
  onClick,
  variant = "default",
  className = ""
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  variant?: "default" | "outline";
  className?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const baseClasses = "p-4 border rounded-lg transition-colors text-left cursor-pointer";
  const variantClasses = variant === "default" 
    ? `${isDark ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' : 'border-gray-200 bg-white hover:bg-gray-50'}`
    : `${isDark ? 'border-gray-600 bg-transparent hover:bg-gray-800/50' : 'border-gray-200 bg-transparent hover:bg-gray-50'}`;

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
          {icon}
        </div>
        <div className="font-medium text-gray-900 dark:text-gray-100">{title}</div>
      </div>
      {subtitle && (
        <div className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</div>
      )}
    </button>
  );
}

// Stats card component
export function StatsCard({
  title,
  value,
  change,
  icon,
  color,
  onClick
}: {
  title: string;
  value: string;
  change?: string;
  icon: any;
  color: string;
  onClick?: () => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const bgMain = isDark ? 'bg-gray-900/50' : 'bg-white';
  const borderMain = isDark ? 'border-gray-800' : 'border-gray-200';
  const textMain = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgCardHover = isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50';

  const Icon = icon;
  
  return (
    <Card 
      className={`${bgMain} border ${borderMain} ${bgCardHover} transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${textSecondary}`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textMain}`}>{value}</div>
        {change && (
          <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} с прошлой недели
          </p>
        )}
      </CardContent>
    </Card>
  );
}
