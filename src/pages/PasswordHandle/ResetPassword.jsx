import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/authServices/Authervices.jsx";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons/index.js";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button.js";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmMotDePasse, setConfirmMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (motDePasse !== confirmMotDePasse) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await resetPassword(token, motDePasse);
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Erreur Reset Password :", err.response?.data || err.message);
      setError("Erreur lors de la réinitialisation du mot de passe.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to login
        </button>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below.
          </p>
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleResetPassword}>
            <div className="space-y-6">
              <div>
                <Label>New Password <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
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

              <div>
                <Label>Confirm Password <span className="text-error-500">*</span></Label>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmMotDePasse}
                  onChange={(e) => setConfirmMotDePasse(e.target.value)}
                  required
                />
              </div>

              <div>
                <Button className="w-full" size="sm" type="submit">
                  Reset Password
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
