import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Building2,
  Users,
  Home,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../redux/actions/auth";
import logo from "../assets/logo.jpg";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: <Home className="h-4 w-4 text-blue-500" />,
    href: "/dashboard",
  },
  {
    title: "Personas",
    icon: <Users className="h-4 w-4 text-blue-500" />,
    children: [
      { title: "Crear", icon: <Plus className="h-4 w-4 text-blue-500" />, href: "/dashboard/people/create" },
      { title: "Listar", icon: <List className="h-4 w-4 text-blue-500" />, href: "/dashboard/people" },
    ],
  },
  {
    title: "Torres",
    icon: <Building2 className="h-4 w-4 text-blue-500" />,
    children: [
      { title: "Crear", icon: <Plus className="h-4 w-4 text-blue-500" />, href: "/dashboard/towers/create" },
      { title: "Listar", icon: <List className="h-4 w-4 text-blue-500" />, href: "/dashboard/towers" },
    ],
  },
  {
    title: "Apartamentos",
    icon: <Shield className="h-4 w-4 text-blue-500" />,
    children: [
      { title: "Crear", icon: <Plus className="h-4 w-4 text-blue-500" />, href: "/dashboard/apartments/create" },
      { title: "Listar", icon: <List className="h-4 w-4 text-blue-500" />, href: "/dashboard/apartments" },
    ],
  },
];

function Sidebar({ logout }) {
  const [expandedItems, setExpandedItems] = useState([]);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const toggleExpanded = (title) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const itemBtnBase =
    "w-full h-9 flex items-center justify-start gap-2 rounded-md px-3 text-sm";
  const ghostBtn = "hover:bg-white-100 text-white-700 transition-colors";
  const secondaryBtn = "bg-gray-100 text-gray-900";

  return (
    <div className="flex flex-col h-screen w-64 bg-blue-900 text-white fixed left-0 top-0 bottom-0 border-r border-blue-800">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <img src={logo} alt="HOME-ACCES" className="h-8 w-8 object-contain" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">
            HOME-ACCESS
          </span>
          <span className="text-xs text-sidebar-foreground/60">
            Administrador de Seguridad
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <Link to={item.href}>
                  <button
                    className={`${itemBtnBase} ${
                      pathname === item.href ? secondaryBtn : ghostBtn
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </button>
                </Link>
              ) : (
                <button
                  className={`${itemBtnBase} ${ghostBtn} justify-between`}
                  onClick={() => toggleExpanded(item.title)}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </div>
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className="h-4 w-4 text-blue-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                  )}
                </button>
              )}

              {/* Subitems */}
              {item.children && expandedItems.includes(item.title) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link key={child.href} to={child.href}>
                      <button
                        className={`w-full h-8 flex items-center justify-start gap-2 rounded-md px-3 text-sm ${
                          pathname === child.href ? secondaryBtn : ghostBtn
                        }`}
                      >
                        {child.icon}
                        {child.title}
                      </button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="h-px text-black-900 mb-5" />
        <div className="space-y-1">
          <button className={`w-full ${itemBtnBase} ${ghostBtn}`}>
            <Settings className="h-4 w-4 text-blue-500" />
            Configuración
          </button>
          <button
            className={`w-full ${itemBtnBase} ${ghostBtn} text-white-600 hover:text-white-700`}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { logout: logoutAction })(Sidebar);
