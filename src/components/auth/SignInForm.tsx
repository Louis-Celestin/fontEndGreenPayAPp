import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authServices/Authervices.jsx";
import {  EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { ClipLoader } from "react-spinners"; // ✅ Ajout du loader
import PageMeta from "../../components/common/PageMeta";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [mot_de_passe, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [isLoading, setIsLoading] = useState(false); // ✅ État du loader
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (userRole) {
      const roleRoutes = {
        agent: "/agent",
        "responsable de section": "/section",
        "responsable d'entité": "/entite",
        "responsable entité financière": "/ref",
        "responsable entité générale": "/reg",
      };
      navigate(roleRoutes[userRole] || "/");
    }
  }, [userRole, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // ✅ Démarre le loader

    try {
      const response = await login(email, mot_de_passe);
      console.log("Réponse API :", response);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user_id", response.user.id);
        localStorage.setItem("agent_id", response.user.agent_id);
        localStorage.setItem("user_email", response.user.email);

        if (response.user.agents) {
          localStorage.setItem("agent_nom", response.user.agents.nom);
          localStorage.setItem("agent_fonction", response.user.agents.fonction);
          localStorage.setItem("agent_entite", response.user.agents.entite_id);
          localStorage.setItem("agent_section", response.user.agents.section_id);
          localStorage.setItem("role", response.user.agents.fonction.toLowerCase());
        }

        setUserRole(response.user.agents.fonction.toLowerCase());
        console.log("Token enregistré :", localStorage.getItem("token"));
      } else {
        throw new Error("Aucun token reçu");
      }
    } catch (err) {
      console.error("Erreur Login :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Identifiants incorrects !");
    } finally {
      setIsLoading(false); // ✅ Stoppe le loader
    }
  };

  return (
    <>
    <PageMeta title="Connexion" description="Page de connexion" />
    {/* Loader de la page */}
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto"></div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Se connecter!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entrez vos identifiants pour vous connecter!
          </p>

          {error && <p className="text-red-500">{error}</p>}

          {/* Loader central */}
          {isLoading && (
            <div className="flex justify-center my-6">
              <ClipLoader size={35} color="#4F46E5" loading={isLoading} />
            </div>
          )}

          {/* Formulaire seulement si pas loading */}
          {!isLoading && (
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="info@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label>
                    Mot de passe <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={mot_de_passe}
                      onChange={(e) => setPassword(e.target.value)}
                      
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigate("/password/reset-password")}
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Connexion
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
