import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createDemande } from "../../services/demandesServices/demandeService";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import FileUpload from "../../components/form/input/FileInput"; // Composant pour gérer les fichiers

export default function CreateDemande() {
  const navigate = useNavigate();

  // ✅ États pour gérer les champs du formulaire
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [beneficiaire, setBeneficiaire] = useState("");
  const [requiertProforma, setRequiertProforma] = useState(false);
  const [proforma, setProforma] = useState(null);
  const [loading, setLoading] = useState(false);
  const agent_id = localStorage.getItem("agent_id");
  // ✅ Fonction pour gérer l’envoi du formulaire
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Création d'un objet contenant les données de la demande
  //     const formData = new FormData();
  //     formData.append("agent_id", agent_id);
  //     formData.append("montant", montant);
  //     formData.append("motif", motif);
  //     formData.append("beneficiaire", beneficiaire);
  //     formData.append("requiertProforma", requiertProforma);
  //     if (proforma) {
  //       formData.append("proforma", proforma); // Ajouter le fichier à FormData
  //     }
  //     console.log(formData);
  //     await createDemande(formData);

  //     // ✅ Notification SweetAlert2 en cas de succès
  //     Swal.fire({
  //       title: "Succès !",
  //       text: "Votre demande de paiement a été créée avec succès.",
  //       icon: "success",
  //       confirmButtonText: "OK",
  //       confirmButtonColor: "#28a745",
  //     }).then(() => navigate("/listeDemandes")); // Redirection après validation
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Erreur !",
  //       text: "Une erreur s'est produite lors de la création de la demande.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Création de FormData pour inclure le fichier
  //     const formData = new FormData();
  //     formData.append("agent_id", agent_id);
  //     formData.append("montant", montant);
  //     formData.append("motif", motif);
  //     formData.append("beneficiaire", beneficiaire);
  //     formData.append("requiertProforma", requiertProforma);
  //     if (proforma) {
  //       formData.append("proforma", proforma);
  //     }

  //     console.log([...formData]); // ✅ Debug : Voir les données envoyées

  //     await createDemande(formData); // Appel API

  //     // ✅ Notification SweetAlert2 en cas de succès
  //     Swal.fire({
  //       title: "Succès !",
  //       text: "Votre demande de paiement a été créée avec succès.",
  //       icon: "success",
  //       confirmButtonText: "OK",
  //       confirmButtonColor: "#28a745",
  //     }).then(() => navigate("/listeDemandes"));
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Erreur !",
  //       text: "Une erreur s'est produite lors de la création de la demande.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      if (proforma) {
        formData.append("proforma", proforma); // ✅ Ajout du fichier
      }
  
      console.log([...formData]); // ✅ Debugging pour voir les données
  
      await createDemande(formData); // Envoi des données à l'API
  
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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Créer une demande de paiement
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🔹 Montant */}
        <div>
          <Label>
            Montant (FCFA) <span className="text-error-500">*</span>
          </Label>
          <Input
            type="number"
            placeholder="Entrez le montant"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
        </div>

        {/* 🔹 Motif */}
        <div>
          <Label>
            Motif <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Entrez le motif"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            required
          />
        </div>

        {/* 🔹 Bénéficiaire */}
        <div>
          <Label>
            Bénéficiaire <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            placeholder="Nom du bénéficiaire"
            value={beneficiaire}
            onChange={(e) => setBeneficiaire(e.target.value)}
            required
          />
        </div>

        {/* 🔹 Checkbox pour la proforma */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={requiertProforma}
            onChange={() => setRequiertProforma(!requiertProforma)}
          />
          <Label>Cette demande nécessite une proforma</Label>
        </div>

        {/* 🔹 Upload du fichier proforma si nécessaire */}
        {requiertProforma && (
          <div>
            <Label>
              Joindre la proforma (PDF/Image){" "}
              <span className="text-error-500">*</span>
            </Label>
            <FileUpload
              onFileSelect={(file) => {
                console.log("Fichier sélectionné :", file); // ✅ Debugging
                setProforma(file);
              }}
            />
          </div>
        )}

        {/* 🔹 Bouton de soumission */}
        <div>
          <Button type="submit" className="w-full" size="sm" disabled={loading}>
            {loading ? "Envoi en cours..." : "Créer la demande"}
          </Button>
        </div>
      </form>
    </div>
  );
}
