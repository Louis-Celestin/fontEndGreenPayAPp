import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
// import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { isAuthenticated } from "./services/authServices/Authervices.jsx"; // ✅ Correction d'import
import AuthGuard from "./components/authGuard/AuthGuard.jsx"; // ✅ Protection des routes
import  CreateDemande  from "./pages/Demandes/CreateDemande.jsx";
import  ListeDemandes  from "./pages/Demandes/ListeDemandes.jsx";
import  DetailDemande  from "./pages/Demandes/DetailDemande.jsx";
import  ValidationsPending  from "./pages/Validations/ValidationPending.jsx";
import  ValidationDetail  from "./pages/Validations/ValidationDetail.jsx";
import  ValidationsDone  from "./pages/Validations/ValidationsDone.jsx";
import  PaiementDetail  from "./pages/Paiments/PaiementDetail.jsx";
import  ListePaiements  from "./pages/Paiments/ListePaiements.jsx";
import  PaiementsDone  from "./pages/Paiments/PaiementsDone.jsx";
import  ForgotPassword  from "./pages/PasswordHandle/ForgotPassword.jsx";
import  ResetPassword  from "./pages/PasswordHandle/ResetPassword.jsx"

export default function App() {
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
            <Route index path="/" element={<Home />} />

            {/* Personal pages */}
            <Route path="/createDemande" element={<CreateDemande />} />
            <Route path="/listeDemandes" element={<ListeDemandes />} />
            <Route path="/demandes/:id" element={<DetailDemande />} />
            <Route path="/validationsPending" element={<ValidationsPending/>} />
            <Route path="/validations/:demande_id" element={<ValidationDetail />} />
            <Route path="/listeValidationsDone" element={<ValidationsDone />} />
            <Route path="/listePaiementsDone" element={<ValidationsDone />} />
            <Route path="/paiementsDone" element={<PaiementsDone />} />
            <Route path="/paiementDetail/:demande_id" element={<PaiementDetail />} />
            <Route path="/listePaiements" element={<ListePaiements />} />



            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            {/* <Route path="/demandes" element={<DemandePaiement />} /> */}


            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
        </Route>

        {/* ✅ Redirection si l'utilisateur n'est pas connecté */}
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />

        {/* ✅ Redirection par défaut */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}
