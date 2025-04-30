import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { isAuthenticated } from "./services/authServices/Authervices.jsx";
import AuthGuard from "./components/authGuard/AuthGuard.jsx";
import CreateDemande from "./pages/Demandes/CreateDemande.jsx";
import DemandeEdit from "./pages/Demandes/DemandeEdit.jsx";
import ListeDemandes from "./pages/Demandes/ListeDemandes.jsx";
import DetailDemande from "./pages/Demandes/DetailDemande.jsx";
import ValidationsPending from "./pages/Validations/ValidationPending.jsx";
import ValidationDetail from "./pages/Validations/ValidationDetail.jsx";
import ValidationsDone from "./pages/Validations/ValidationsDone.jsx";
import PaiementDetail from "./pages/Paiments/PaiementDetail.jsx";
import ListePaiements from "./pages/Paiments/ListePaiements.jsx";
import PaiementsDone from "./pages/Paiments/PaiementsDone.jsx";
import ForgotPassword from "./pages/PasswordHandle/ForgotPassword.jsx";
import ResetPassword from "./pages/PasswordHandle/ResetPassword.jsx";
import Agent from "./pages/Dashboard/Agent.jsx";
import Section from "./pages/Dashboard/Section.jsx";
import Ref from "./pages/Dashboard/Ref.jsx";
import Reg from "./pages/Dashboard/Reg.jsx";
import Entite from "./pages/Dashboard/Entite.jsx";

export default function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role")?.trim().toLowerCase() || "");

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("role")?.trim().toLowerCase() || "";
      setUserRole(updatedRole);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const roleRoutes = {
    agent: "/agent",
    "responsable de section": "/section",
    "responsable d'entité": "/entite",
    "responsable entité financière": "/ref",
    "responsable entité générale": "/reg",
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ✅ Routes publiques */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/password/reset-password" element={<ForgotPassword />} />
        <Route path="/password/reset-password/:token" element={<ResetPassword />} />

        {/* ✅ Routes protégées avec AuthGuard */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/createDemande" element={<CreateDemande />} />
            <Route path="/demandeEdit/:id" element={<DemandeEdit />} />
            <Route path="/listeDemandes" element={<ListeDemandes />} />
            <Route path="/demandes/:id" element={<DetailDemande />} />
            <Route path="/validationsPending" element={<ValidationsPending />} />
            <Route path="/validations/:demande_id" element={<ValidationDetail />} />
            <Route path="/listeValidationsDone" element={<ValidationsDone />} />
            <Route path="/listePaiementsDone" element={<PaiementsDone />} />
            <Route path="/paiementsDone" element={<PaiementsDone />} />
            <Route path="/paiementDetail/:demande_id" element={<PaiementDetail />} />
            <Route path="/listePaiements" element={<ListePaiements />} />

            {/* Dashboards spécifiques */}
            <Route path="/agent" element={<Agent />} />
            <Route path="/section" element={<Section />} />
            <Route path="/ref" element={<Ref />} />
            <Route path="/reg" element={<Reg />} />
            <Route path="/entite" element={<Entite />} />
          </Route>
        </Route>

        {/* ✅ Redirection dynamique selon le rôle */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              roleRoutes[userRole] ? <Navigate to={roleRoutes[userRole]} replace /> : <Navigate to="/signin" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* ✅ Redirection par défaut */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}
