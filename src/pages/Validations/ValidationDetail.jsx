import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { validerDemande, rejeterDemande } from "../../services/validationsServices/validationServices";
import Swal from "sweetalert2";
import Button from "../../components/ui/button/Button";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // ✅ Loader visuel
import PageMeta from "../../components/common/PageMeta";
import API_URL from "../../config/url"; // ✅ URL de l'API

const DemandeDetail = () => {
  const { demande_id } = useParams();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // ✅ Nouveau pour action de validation/rejet
  const [error, setError] = useState("");
  const utilisateurId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemandeDetail = async () => {
      try {
        const response = await axios.get(`${API_URL}/demandes/getDemandePaiementById/${demande_id}`);
        setDemande(response.data.demande);
      } catch (err) {
        setError("Erreur lors du chargement de la demande.");
      } finally {
        setLoading(false);
      }
    };

    fetchDemandeDetail();
  }, [demande_id]);

  const handleValidation = async () => {
    setActionLoading(true); // ✅ Active le loader action
    try {
      await validerDemande(demande_id, utilisateurId);
      Swal.fire("Validé !", "La demande a été approuvée.", "success");
      navigate("/listeValidationsDone");
    } catch {
      Swal.fire("Erreur", "Impossible de valider la demande.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejet = async () => {
    const { value: commentaire } = await Swal.fire({
      title: "Rejeter la demande",
      input: "textarea",
      inputLabel: "Commentaire",
      inputPlaceholder: "Indiquez la raison du rejet...",
      showCancelButton: true,
    });

    if (commentaire) {
      setActionLoading(true); // ✅ Active le loader action
      try {
        await rejeterDemande(demande_id, utilisateurId, commentaire);
        Swal.fire("Rejetée !", "La demande a été rejetée.", "success");
        navigate("/listeValidationsDone");
      } catch {
        Swal.fire("Erreur", "Impossible de rejeter la demande.", "error");
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#0d6efd" size={50} loading={loading} />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!demande) return <p>Aucune demande trouvée.</p>;

  return (
    <>
      <PageMeta title="Détail de la validation"/>
    <div className="relative max-w-5xl mx-auto p-6">
      {actionLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <ClipLoader color="#0d6efd" size={50} />
        </div>
      )}

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
    </>
  );
};

export default DemandeDetail;
