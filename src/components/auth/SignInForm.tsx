import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authServices/Authervices.jsx"; // Import du service d'auth
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [mot_de_passe, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await login(email, mot_de_passe);
      console.log("Réponse API :", response); // ✅ Debugging : affiche la réponse API

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user_id", response.user.id);
        localStorage.setItem("agent_id", response.user.agent_id);
        localStorage.setItem("user_email", response.user.email);
        
        // Ajout des infos de l'agent
        if (response.user.agents) {
          localStorage.setItem("agent_nom", response.user.agents.nom);
          localStorage.setItem("agent_fonction", response.user.agents.fonction);
          localStorage.setItem("agent_entite", response.user.agents.entite_id);
          localStorage.setItem("agent_section", response.user.agents.section_id);
        }

        console.log("Token enregistré :", localStorage.getItem("token")); // ✅ Vérifie si le token est bien stocké
        navigate("/"); // Rediriger après connexion
      } else {
        throw new Error("Aucun token reçu");
      }
    } catch (err) {
      console.error("Erreur Login :", err.response?.data || err.message);
      setError(err.response?.data?.message || "Identifiants incorrects !");
    }
  };
  

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </button>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
          {error && <p className="text-red-500">{error}</p>} {/* Affichage des erreurs */}

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Password <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={mot_de_passe}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? <EyeIcon className="fill-gray-500 size-5" /> : <EyeCloseIcon className="fill-gray-500 size-5" />}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="text-gray-700 dark:text-gray-400">Keep me logged in</span>
                </div>
                <button
                  onClick={() => navigate("/password/reset-password")}
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </button>
              </div>
              <div>
                <Button className="w-full" size="sm" type="submit">
                  Sign in
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")} className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
