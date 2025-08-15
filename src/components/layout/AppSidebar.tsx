
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  UserRound,
  LogOut,
  ArrowRightLeft,
  Clock,
  Wallet,
  ClipboardList,
} from "lucide-react";

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Markets",
      icon: BarChart3,
      children: [
        {
          title: "Stocks",
          icon: LineChart,
          path: "/markets/stocks",
        },
        {
          title: "Crypto",
          icon: BarChart3,
          path: "/markets/crypto",
        },
        {
          title: "Forex",
          icon: DollarSign,
          path: "/markets/forex",
        },
        {
          title: "Mutual Funds",
          icon: PieChart,
          path: "/markets/funds",
        },
      ],
    },
    {
      title: "Portfolio",
      icon: PieChart,
      path: "/portfolio",
    },
    {
      title: "Transactions",
      icon: ArrowRightLeft,
      path: "/transactions",
    },
    {
      title: "History",
      icon: Clock,
      path: "/history",
    },
    {
      title: "Account",
      icon: UserRound,
      path: "/account",
    },
    {
      title: "Funds",
      icon: Wallet,
      path: "/funds",
    },
    {
      title: "Activity Logs",
      icon: ClipboardList,
      path: "/activity",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="border-r bg-trading-blue">
      <SidebarHeader className="py-6">
        <div className="flex items-center px-4">
          <h2 className="text-xl font-bold text-white">UnivTrade</h2>
          <SidebarTrigger className="ml-auto h-8 w-8 text-white" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {!item.children ? (
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.path)}
                    className={isActive(item.path) ? "bg-trading-blue-lighter" : ""}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                ) : (
                  <>
                    <SidebarMenuButton>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenu>
                      {item.children.map((child) => (
                        <SidebarMenuItem key={child.title}>
                          <SidebarMenuButton
                            onClick={() => handleNavigation(child.path)}
                            className={isActive(child.path) ? "bg-trading-blue-lighter" : ""}
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          {user && (
            <div className="flex items-center justify-between p-3 text-white">
              <div className="flex items-center">
                <UserRound className="mr-2 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-white/70">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full p-2 text-white hover:bg-trading-blue-lighter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
