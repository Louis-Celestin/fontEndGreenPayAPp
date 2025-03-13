import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDemandesEnAttente, validerDemande, rejeterDemande } from "../../services/validationsServices/validationServices";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Button from "../../components/ui/button/Button";

export default function ValidationsPending() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const utilisateurId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await getDemandesEnAttente(utilisateurId);
        setDemandes(response);
      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Impossible de charger les demandes en attente.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, [utilisateurId]);

  // ✅ Fonction pour valider une demande
  const handleValidation = async (id) => {
    try {
      await validerDemande(id, utilisateurId);
      setDemandes(demandes.filter((demande) => demande.id !== id));
      Swal.fire("Validé !", "La demande a été approuvée.", "success");
    } catch (error) {
      Swal.fire("Erreur", "Impossible de valider la demande.", "error");
    }
  };

  // ✅ Fonction pour rejeter une demande avec un commentaire
  const handleRejet = async (id) => {
    const { value: commentaire } = await Swal.fire({
      title: "Rejeter la demande",
      input: "textarea",
      inputLabel: "Commentaire",
      inputPlaceholder: "Indiquez la raison du rejet...",
      inputAttributes: { "aria-label": "Écrivez ici" },
      showCancelButton: true,
    });

    if (commentaire) {
      try {
        await rejeterDemande(id, utilisateurId, commentaire);
        setDemandes(demandes.filter((demande) => demande.id !== id));
        Swal.fire("Rejetée !", "La demande a été rejetée.", "success");
      } catch (error) {
        Swal.fire("Erreur", "Impossible de rejeter la demande.", "error");
      }
    }
  };

  // ✅ Définition des colonnes pour react-data-table
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
    { name: "Montant (FCFA)", selector: (row) => row.montant, sortable: true, right: true },
    { name: "Bénéficiaire", selector: (row) => row.beneficiaire, sortable: true },
    {
      name: "Statut",
      selector: (row) => row.statut,
      cell: (row) => (
        <span
          className={`px-2 py-1 text-sm rounded ${
            row.statut.includes("validation") ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
          }`}
        >
          {row.statut}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <Button size="xs" variant="primary" onClick={() => navigate(`/validations/${row.id}`)}>
            🔍
          </Button>
          <Button size="xs" onClick={() => handleValidation(row.id)}>
            ✅
          </Button>
          <Button size="xs" variant="danger" onClick={() => handleRejet(row.id)}>
            ❌
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Demandes en attente de validation</h2>
      
      <DataTable
        columns={columns}
        data={demandes}
        progressPending={loading}
        paginationPerPage={5}
        paginationTotalRows={demandes.length}
        pagination
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
}
