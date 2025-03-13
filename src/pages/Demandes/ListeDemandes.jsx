import { useEffect, useState } from "react";
import { getDemandes, deleteDemande } from "../../services/demandesServices/demandeService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Button from "../../components/ui/button/Button";

// ✅ Définition des colonnes du tableau
const columns = (handleDelete, navigate) => [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
    width: "80px",
  },
  {
    name: "Montant (FCFA)",
    selector: (row) => row.montant,
    sortable: true,
    right: true,
  },
  {
    name: "Bénéficiaire",
    selector: (row) => row.beneficiaire,
    sortable: true,
  },
  {
    name: "Statut",
    selector: (row) => row.statut,
    sortable: true,
    cell: (row) => (
      <span
        className={`px-2 py-1 text-sm rounded ${
          row.statut === "paye"
            ? "bg-green-100 text-green-700"
            : row.statut.includes("validation")
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.statut}
      </span>
    ),
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="flex gap-2">
        <Button size="xs" onClick={() => navigate(`/demandes/${row.id}`)}>
          Voir
        </Button>
        <Button size="xs" variant="danger" onClick={() => handleDelete(row.id)}>
          Supprimer
        </Button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

export default function ListeDemandes() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const utilisateur_id = localStorage.getItem("user_id"); // ✅ Récupérer l'ID utilisateur

  // ✅ Charger les demandes depuis l'API avec pagination
  useEffect(() => {
    const fetchDemandes = async () => {
      setLoading(true);
      try {
        const response = await getDemandes(utilisateur_id, currentPage);
        setDemandes(response.demandes);
        setTotalPages(response.totalPages);
      } catch (error) {
        Swal.fire({
          title: "Erreur",
          text: "Impossible de charger les demandes.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDemandes();
  }, [utilisateur_id, currentPage]); // ✅ Dépendances mises à jour

  // ✅ Fonction pour supprimer une demande
  const handleDelete = async (id) => {
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
        await deleteDemande(id);
        setDemandes(demandes.filter((demande) => demande.id !== id));
        Swal.fire("Supprimée !", "La demande a été supprimée.", "success");
      } catch (error) {
        Swal.fire("Erreur", "Impossible de supprimer la demande.", "error");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Liste des demandes de paiement</h2>

      <DataTable
        columns={columns(handleDelete, navigate)}
        data={demandes}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalPages * 5} // Nombre total d'éléments (5 par page)
        paginationPerPage={5}
        onChangePage={(page) => setCurrentPage(page)}
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
}
