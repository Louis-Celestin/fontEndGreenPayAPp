import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Correction : 'react-router' => 'react-router-dom'

// Import des icônes
import { GridIcon, PageIcon, ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

// Fonction pour récupérer le rôle de l'utilisateur connecté
const getUserRole = () => {
  return localStorage.getItem("role") || "Agent"; // Par défaut "Agent"
};

// Fonction pour filtrer les éléments du menu selon le rôle
const getNavItemsByRole = (role) => {
  let menu = [{ icon: <GridIcon />, name: "Dashboard", path: "/" }];

  if (
    [
      "Agent",
      "Responsable de section",
      "Responsable d'entité",
      "Responsable Entité Financière",
      "Responsable Entité Générale",
    ].includes(role)
  ) {
    menu.push({
      name: "Demandes de paiements",
      icon: <PageIcon />,
      subItems: [
        { name: "Nouvelle demande", path: "/createDemande" },
        { name: "Liste des demandes", path: "/listeDemandes" },
      ],
    });
  }

  if (
    [
      "Responsable de section",
      "Responsable d'entité",
      // "Responsable Entité Financière",
      "Responsable Entité Générale",
    ].includes(role)
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

  if (["Responsable Entité Financière"].includes(role)) {
    menu.push(
      {
        name: "Paiements",
        icon: <PageIcon />,
        subItems: [
          { name: "Liste de paiements", path: "/listePaiements" },
          { name: "Paiements effectués", path: "/paiementsDone" },
        ],
      },
    );
  }

  return menu;
};

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [role, setRole] = useState(getUserRole()); // Récupération du rôle
  const navItems = getNavItemsByRole(role);

  // 🔹 Stocke quel sous-menu est ouvert
  const [openSubmenus, setOpenSubmenus] = useState({});

  // Fonction pour savoir si un lien est actif
  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  // Fonction pour gérer l'ouverture/fermeture d'un sous-menu
  const handleSubmenuToggle = (index) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [index]: !prev[index], // Inverse l'état actuel du sous-menu
    }));
  };

  useEffect(() => {
    // Au chargement, ouvrir uniquement le sous-menu contenant la page actuelle
    const activeSubmenus = {};
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
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
            src="/images/logo/logo.svg"
            alt="Logo"
            width={150}
            height={40}
          />
          <img
            className="hidden dark:block"
            src="/images/logo/logo-dark.svg"
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
                {nav.subItems ? (
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
                    to={nav.path}
                    className={`menu-item group ${
                      isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }`}
                  >
                    <span
                      className={`menu-item-icon-size ${
                        isActive(nav.path)
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
                {nav.subItems &&
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
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
