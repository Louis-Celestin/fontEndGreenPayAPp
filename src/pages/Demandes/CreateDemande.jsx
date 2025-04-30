import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createDemande } from "../../services/demandesServices/demandeService";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import FileUpload from "../../components/form/input/FileInput";
import { ClipLoader } from "react-spinners"; // ✅ Utilisation de react-spinners directement

export default function CreateDemande() {
  const navigate = useNavigate();

  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [beneficiaire, setBeneficiaire] = useState("");
  const [requiertProforma, setRequiertProforma] = useState(false);
  const [proforma, setProforma] = useState(null);
  const [loading, setLoading] = useState(false);

  const agent_id = localStorage.getItem("agent_id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("agent_id", agent_id);
      formData.append("montant", montant);
      formData.append("motif", motif);
      formData.append("beneficiaire", beneficiaire);
      formData.append("requiert_proforma", requiertProforma);
      if (proforma) formData.append("proforma", proforma);

      await createDemande(formData);

      Swal.fire({
        title: "Succès !",
        text: "Votre demande de paiement a été créée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => navigate("/listeDemandes"));

    } catch (error) {
      Swal.fire({
        title: "Erreur !",
        text: "Une erreur s'est produite lors de la création de la demande.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Loader en overlay si loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg z-50">
          <ClipLoader size={45} color="#4F46E5" loading={loading} />
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Créer une demande de paiement
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Montant (FCFA) <span className="text-red-500">*</span></Label>
          <Input
            type="number"
            placeholder="Entrez le montant"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Motif <span className="text-red-500">*</span></Label>
          <Input
            type="text"
            placeholder="Entrez le motif"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Bénéficiaire <span className="text-red-500">*</span></Label>
          <Input
            type="text"
            placeholder="Nom du bénéficiaire"
            value={beneficiaire}
            onChange={(e) => setBeneficiaire(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={requiertProforma}
            onChange={() => setRequiertProforma(!requiertProforma)}
          />
          <Label>Cette demande nécessite une proforma</Label>
        </div>

        {requiertProforma && (
          <div>
            <Label>Joindre la proforma (PDF/Image)</Label>
            <FileUpload onFileSelect={(file) => setProforma(file)} />
          </div>
        )}

        <div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Envoi en cours..." : "Créer la demande"}
          </Button>
        </div>
      </form>
    </div>
  );
}
