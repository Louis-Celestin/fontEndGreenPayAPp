import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../../components/ui/button/Button";

const DemandeDetail = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const utilisateurId = localStorage.getItem("user_id"); // ID de l'utilisateur connecté

  useEffect(() => {
    // 🔹 Charger les détails de la demande depuis l'API
    const fetchDemandeDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/demandes/getDemandePaiementById/${id}`
        );
        setDemande(response.data.demande);
      } catch (err) {
        setError("Erreur lors du chargement de la demande.");
      } finally {
        setLoading(false);
      }
    };

    fetchDemandeDetail();
  }, [id]);

  // ✅ Supprimer une demande (seulement si c'est l'auteur et pas encore validée)
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:5000/api/demandes/supprimerDemandePaiement/${id}`
        );
        Swal.fire("Supprimée !", "La demande a été supprimée.", "success");
        navigate("/listeDemandes");
      } catch (error) {
        Swal.fire("Erreur", "Impossible de supprimer la demande.", "error");
      }
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!demande) return <p>Aucune demande trouvée.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Détail de la Demande #{demande.id}
      </h2>

      {/* ✅ Conteneur principal avec deux colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📌 Carte 1 - Informations de la demande */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Informations de la Demande
          </h3>
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Montant :</strong> {demande.montant} FCFA
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Motif :</strong> {demande.motif}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Statut :</strong>{" "}
              <span
                className={`px-2 py-1 text-sm rounded ${
                  demande.statut === "paye"
                    ? "bg-green-100 text-green-700"
                    : demande.statut.includes("validation")
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {demande.statut}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Demandeur :</strong> {demande.agents.nom}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Date de création :</strong>{" "}
              {new Date(demande.date_creation).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 📌 Carte 2 - Proforma (si disponible) */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Proforma
          </h3>
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
            <p className="text-gray-600 dark:text-gray-400">
              Aucune proforma disponible.
            </p>
          )}
        </div>
      </div>

      {/* ✅ Historique des validations */}
      {demande.validations.length > 0 && (
        <div className="mt-6 p-5 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Historique des validations
          </h3>
          <ul className="space-y-2">
            {demande.validations.map((validation, index) => (
              <li
                key={index}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Validé par :</strong>{" "}
                  {validation.utilisateurs["agents"].nom}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Statut :</strong> {validation.statut}
                </p>
                {validation.commentaire && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Commentaire :</strong> {validation.commentaire}
                  </p>
                )}
                {validation.date_validation && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Date de validation :</strong>{" "}
                    {new Date(validation.date_validation).toLocaleDateString()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Boutons de gestion */}
      {demande.agent_id == utilisateurId &&
        !demande.statut.includes("validation") && (
          <div className="mt-6 flex gap-4">
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate(`/editDemande/${demande.id}`)}
            >
              Modifier
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        )}
    </div>
  );
};

export default DemandeDetail;
