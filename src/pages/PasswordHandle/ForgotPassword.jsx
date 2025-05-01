import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authServices/Authervices.jsx";
import { ChevronLeftIcon } from "../../icons/index.js";
import Label from "../../components/form/Label.js";
import Input from "../../components/form/input/InputField.js";
import Button from "../../components/ui/button/Button.js";
import { ClipLoader } from "react-spinners"; // ✅ Ajout loader
import PageMeta from "../../components/common/PageMeta";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ Loader
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true); // ✅ Démarre le loader

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      console.error("Erreur Forgot Password :", err.response?.data || err.message);
      setError("Erreur lors de la demande de réinitialisation.");
    } finally {
      setIsLoading(false); // ✅ Stoppe le loader
    }
  };

  return (
    <>
      <PageMeta title="Mot de passe oublié" description="Réinitialisez votre mot de passe" />

    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Retour à la connexion
        </button>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Mot de passe oublié ?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>

          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Loader */}
          {isLoading && (
            <div className="flex justify-center my-6">
              <ClipLoader size={35} color="#4F46E5" loading={isLoading} />
            </div>
          )}

          {/* Formulaire uniquement si pas loading */}
          {!isLoading && (
            <form onSubmit={handleForgotPassword}>
              <div className="space-y-6">
                <div>
                  <Label>Email <span className="text-error-500">*</span></Label>
                  <Input
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Envoyer le lien
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
