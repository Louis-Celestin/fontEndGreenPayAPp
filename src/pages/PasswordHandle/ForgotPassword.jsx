import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authServices/Authervices.jsx"; 
import { ChevronLeftIcon } from "../../icons/index.js";
import Label from "../../components/form/Label.js"
import Input from "../../components/form/input/InputField.js";
import Button from "../../components/ui/button/Button.js"
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      console.error("Erreur Forgot Password :", err.response?.data || err.message);
      setError("Erreur lors de la demande de réinitialisation.");
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
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and we'll send you a reset link.
          </p>
          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleForgotPassword}>
            <div className="space-y-6">
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Button className="w-full" size="sm" type="submit">
                  Send Reset Link
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
