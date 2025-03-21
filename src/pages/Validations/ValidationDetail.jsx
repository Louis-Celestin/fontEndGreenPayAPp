import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validerDemande, rejeterDemande } from "../../services/validationsServices/validationServices";
import Swal from "sweetalert2";
import Button from "../../components/ui/button/Button";
import axios from "axios";

const DemandeDetail = () => {
  const { demande_id } = useParams();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const utilisateurId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemandeDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/demandes/getDemandePaiementById/${demande_id}`);
        setDemande(response.data.demande);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement de la demande.");
        setLoading(false);
      }
    };

    fetchDemandeDetail();
  }, [demande_id]);

  const handleValidation = async () => {
    try {
      await validerDemande(demande_id, utilisateurId);
      Swal.fire("Validé !", "La demande a été approuvée.", "success");
      navigate("/listeValidationsDone");
    } catch (error) {
      Swal.fire("Erreur", "Impossible de valider la demande.", "error");
    }
  };

  const handleRejet = async () => {
    const { value: commentaire } = await Swal.fire({
      title: "Rejeter la demande",
      input: "textarea",
      inputLabel: "Commentaire",
      inputPlaceholder: "Indiquez la raison du rejet...",
      inputAttributes: { "aria-label": "Écrivez ici" },
      showCancelButton: true,
    });

    if (commentaire) {
      console.log(commentaire);
      await rejeterDemande(demande_id, utilisateurId, commentaire)
        .then((res) => {
          if (res) {
            console.log("OK");
          } else {
            console.log("NOK");
          }
        })
        .catch((err) => console.log(err));
      Swal.fire("Rejetée !", "La demande a été rejetée.", "success");
      navigate("/listeValidationsDone");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!demande) return <p>Aucune demande trouvée.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Détail de la Demande #{demande.id}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations de la Demande</h3>
          <p><strong>Montant :</strong> {demande.montant} FCFA</p>
          <p><strong>Motif :</strong> {demande.motif}</p>
          <p><strong>Statut :</strong> {demande.statut}</p>
          <p><strong>Demandeur :</strong> {demande.agents.nom}</p>
        </div>

        <div className="p-5 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Proforma</h3>
          {demande.proformas.length > 0 ? (
            <div className="flex flex-col items-center">
              <a
                href={demande.proformas[0].fichier}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 hover:underline text-sm"
              >
                Voir la proforma complète
              </a>
              <div className="mt-3">
                <img
                  src={demande.proformas[0].fichier}
                  alt="Proforma"
                  className="w-48 h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Aucune proforma disponible.</p>
          )}
        </div>
      </div>

      {/* ✅ Boutons alignés sous les deux sections */}
      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={handleValidation}>✅ Valider</Button>
        <Button variant="danger" onClick={handleRejet}>❌ Rejeter</Button>
      </div>
    </div>
  );
};

export default DemandeDetail;
