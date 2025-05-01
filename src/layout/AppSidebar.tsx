import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { GridIcon, PageIcon, ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

// 🔹 Types
interface SubItem {
  name: string;
  path: string;
}

interface NavItem {
  icon: React.ReactElement;
  name: string;
  path?: string;
  subItems?: SubItem[];
}

// Fonction pour récupérer le rôle
const getUserRole = (): string => {
  return localStorage.getItem("role") || "Agent";
};

// Fonction pour filtrer les éléments du menu selon le rôle
const getNavItemsByRole = (role: string): NavItem[] => {
  let menu: NavItem[] = [{ icon: <GridIcon />, name: "Dashboard", path: "/" }];

  if (
    [
      "agent",
      "responsable de section",
      "responsable d'entité",
      "responsable entité financière",
      "responsable entité générale",
    ].includes(role)
  ) {
    menu.push({
      name: "Demandes d'achats",
      icon: <PageIcon />,
      subItems: [
        { name: "Nouvelle demande", path: "/createDemande" },
        { name: "Liste de mes demandes", path: "/listeDemandes" },
      ],
    });
  }

  if (
    ["responsable de section", "responsable d'entité"].includes(role)
  ) {
    menu.push({
      name: "Validations",
      icon: <PageIcon />,
      subItems: [
        { name: "Demandes en attente", path: "/validationsPending" },
        { name: "Mes validations", path: "/listeValidationsDone" },
      ],
    });
  }

  return menu;
};

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [role] = useState(getUserRole());
  const navItems = getNavItemsByRole(role);
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const activeSubmenus: Record<number, boolean> = {};
    navItems.forEach((nav, index) => {
      if (Array.isArray(nav.subItems)) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            activeSubmenus[index] = true;
          }
        });
      }
    });
    setOpenSubmenus(activeSubmenus);
  }, [location, isActive]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          <img
            className="dark:hidden"
            src="https://res.cloudinary.com/digitkbit/image/upload/v1744802840/logo_bdj4ks.png"
            width={150}
            height={40}
          />
          <img
            className="hidden dark:block"
            src="https://res.cloudinary.com/digitkbit/image/upload/v1744802840/logo_bdj4ks.png"
            alt="Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => (
              <li key={nav.name}>
                {Array.isArray(nav.subItems) ? (
                  <button
                    onClick={() => handleSubmenuToggle(index)}
                    className={`menu-item group ${
                      openSubmenus[index]
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    } cursor-pointer`}
                  >
                    <span
                      className={`menu-item-icon-size ${
                        openSubmenus[index]
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <ChevronDownIcon
                        className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                          openSubmenus[index] ? "rotate-180 text-brand-500" : ""
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    to={nav.path!}
                    className={`menu-item group ${
                      isActive(nav.path!)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }`}
                  >
                    <span
                      className={`menu-item-icon-size ${
                        isActive(nav.path!)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )}
                {Array.isArray(nav.subItems) &&
                  (isExpanded || isHovered || isMobileOpen) &&
                  openSubmenus[index] && (
                    <ul className="mt-2 space-y-1 ml-9">
                      {nav.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            to={subItem.path}
                            className={`menu-dropdown-item ${
                              isActive(subItem.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            ))}
          </ul>
        </nav>

        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;
