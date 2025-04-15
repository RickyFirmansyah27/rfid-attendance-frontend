
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger } from "./ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { User, ClipboardList, BarChart, LogOut, Home } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "./ui/sidebar";

interface NavItemProps {
  className?: string;
  to: string;
  icon: React.FC<{ className?: string }>;
  title: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ className, to, icon: Icon, title, active }) => {
  const { state } = useSidebar();
  const expanded = state === "expanded";
  const location = useLocation();
  const isActive = active !== undefined ? active : location.pathname === to;

  const content = (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive && "bg-gray-100 text-primary dark:bg-gray-800",
        !expanded && "justify-center px-0",
        className
      )}
    >
      <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
      {expanded && <span>{title}</span>}
    </Link>
  );

  if (!expanded) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-4">
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

const AppLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader>
            Swift Scan
            <SidebarTrigger className="md:hidden ml-auto" />
          </SidebarHeader>
          <SidebarContent>
            <div className="flex flex-col gap-2">
              <NavItem to="/" icon={Home} title="Dashboard" />
              <NavItem to="/attendance" icon={ClipboardList} title="Attendance" />
              <NavItem to="/users" icon={User} title="Users" />
              <NavItem to="/reports" icon={BarChart} title="Reports" />
            </div>
          </SidebarContent>
          <SidebarFooter>
            <Button 
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 ml-0 md:ml-[var(--sidebar-width)] p-4 md:p-8 transition-all duration-300">
          <div className="md:hidden mb-4">
            <SidebarTrigger />
          </div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
