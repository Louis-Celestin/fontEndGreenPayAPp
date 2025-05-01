import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { changePassword } from "../../services/authServices/Authervices";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { ChevronLeftIcon} from "../../icons/index.js";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return Swal.fire("Erreur", "Les nouveaux mots de passe ne correspondent pas.", "error");
    }

    setLoading(true);

    try {
      await changePassword({ currentPassword, newPassword });

      Swal.fire("Succès", "Mot de passe changé avec succès. Vous allez être déconnecté.", "success");

      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      Swal.fire("Erreur", err.response?.data?.message || "Impossible de changer le mot de passe.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Changer le mot de passe" description="Mettez à jour votre mot de passe" />
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto pt-10">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Retour au dashboard
        </button>
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Changer le mot de passe
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Entrez votre ancien mot de passe puis le nouveau.
          </p>

          <form onSubmit={handleChangePassword}>
            <div className="space-y-6">
              <div>
                <Label>Mot de passe actuel <span className="text-error-500">*</span></Label>
                <Input
                  type="password"
                  placeholder="Mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Nouveau mot de passe <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <Label>Confirmation <span className="text-error-500">*</span></Label>
                <Input
                  type="password"
                  placeholder="Confirmez le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Button className="w-full" size="sm" type="submit" disabled={loading}>
                  {loading ? <ClipLoader size={20} color="#fff" /> : "Changer le mot de passe"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
