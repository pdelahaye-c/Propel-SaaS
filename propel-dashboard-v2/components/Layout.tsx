import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  MessageSquare, 
  PieChart, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Building,
  FileText,
  Briefcase
} from 'lucide-react';
import { cn, Switch } from './ui';
import { useTheme } from './ThemeProvider';

// --- Types ---
export type ViewName = 'dashboard' | 'properties' | 'leads' | 'buyers' | 'contracts' | 'call-logs' | 'inbox' | 'reports';

const NavItem = ({ 
    icon: Icon, 
    label, 
    active, 
    collapsed, 
    onClick 
}: { 
    icon: any, 
    label: string, 
    active?: boolean, 
    collapsed?: boolean,
    onClick?: () => void
}) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={cn(
      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
      active 
        ? "bg-primary/10 text-primary shadow-sm" 
        : "text-muted hover:bg-surface hover:text-foreground",
      collapsed ? "justify-center px-2" : ""
    )}
  >
    <Icon className="h-4 w-4 shrink-0" />
    {!collapsed && <span className="truncate">{label}</span>}
  </button>
);

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  currentView: ViewName;
  onViewChange: (view: ViewName) => void;
}

export const Sidebar = ({ isCollapsed, toggleCollapse, currentView, onViewChange }: SidebarProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-30 h-screen border-r border-border bg-background hidden md:flex md:flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Header & Logo */}
      <div className={cn(
        "relative flex h-16 items-center border-b border-border transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "px-6"
      )}>
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground overflow-hidden">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-lg">P</span>
          </div>
          <span className={cn("transition-opacity duration-300", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
            Propel
          </span>
        </div>

        {/* Collapse Toggle Button */}
        <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted shadow-sm hover:text-foreground hover:bg-background transition-colors"
        >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3">
        <nav className="flex flex-col gap-1 space-y-1">
            {!isCollapsed && <div className="px-3 text-xs font-semibold uppercase text-muted mb-2 animate-in fade-in duration-300">Workspace</div>}
            
            <NavItem 
                icon={LayoutDashboard} 
                label="Dashboard" 
                active={currentView === 'dashboard'} 
                collapsed={isCollapsed}
                onClick={() => onViewChange('dashboard')}
            />
            <NavItem 
                icon={Building} 
                label="Properties" 
                active={currentView === 'properties'} 
                collapsed={isCollapsed}
                onClick={() => onViewChange('properties')}
            />
             <NavItem 
                icon={Users} 
                label="Leads" 
                active={currentView === 'leads'}
                collapsed={isCollapsed}
                onClick={() => onViewChange('leads')}
            />
             <NavItem 
                icon={Briefcase} 
                label="Buyers" 
                active={currentView === 'buyers'}
                collapsed={isCollapsed}
                onClick={() => onViewChange('buyers')}
            />
             <NavItem 
                icon={FileText} 
                label="Contracts" 
                active={currentView === 'contracts'}
                collapsed={isCollapsed}
                onClick={() => onViewChange('contracts')}
            />
            <NavItem 
                icon={Phone} 
                label="Call Logs" 
                active={currentView === 'call-logs'}
                collapsed={isCollapsed} 
                onClick={() => onViewChange('call-logs')}
            />
            <NavItem 
                icon={MessageSquare} 
                label="Inbox" 
                active={currentView === 'inbox'}
                collapsed={isCollapsed}
                onClick={() => onViewChange('inbox')}
            />
            
            <div className={cn("transition-all duration-300", isCollapsed ? "my-4 border-t border-border" : "mt-6 mb-2")}>
                {!isCollapsed && <div className="px-3 text-xs font-semibold uppercase text-muted">Analytics</div>}
            </div>
            
            <NavItem icon={PieChart} label="Reports" active={currentView === 'reports'} collapsed={isCollapsed} onClick={() => onViewChange('reports')} />
        </nav>
      </div>

      {/* Footer / Settings */}
      <div className="border-t border-border p-3 space-y-1">
        <NavItem icon={Settings} label="Settings" collapsed={isCollapsed} />
        
        {/* Theme Toggle Integration */}
        {isCollapsed ? (
             <button 
                onClick={toggleTheme}
                title="Toggle Theme"
                className="flex w-full items-center justify-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-foreground transition-colors"
             >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
             </button>
        ) : (
            <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-foreground rounded-md transition-colors">
                <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span>Dark Mode</span>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
        )}

        <NavItem icon={LogOut} label="Log out" collapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export const Topbar = () => {
    return (
        <header className="sticky top-0 z-20 flex h-16 w-full items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur transition-colors">
            <button className="md:hidden text-muted">
                <Menu className="h-6 w-6" />
            </button>
            <div className="flex flex-1 items-center gap-4 md:gap-8">
                <div className="relative flex-1 md:w-96 md:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search leads, properties..." 
                        className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative text-muted hover:text-foreground transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-medium text-primary">
                    JD
                </div>
            </div>
        </header>
    )
}

export const DashboardLayout = ({ 
    children, 
    currentView, 
    onViewChange 
}: { 
    children?: React.ReactNode, 
    currentView: ViewName, 
    onViewChange: (view: ViewName) => void 
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 transition-colors">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        currentView={currentView}
        onViewChange={onViewChange}
      />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
      )}>
        <Topbar />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
            {children}
        </main>
      </div>
    </div>
  );
};
