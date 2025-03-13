import { useEffect, useState } from "react";
import {
  getPaiementsEffectues,
  telechargerPDF,
} from "../../services/paiemntsServices/paiementsServices";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

export default function PaiementsDone() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await getPaiementsEffectues();
        setPaiements(response);
      } catch (error) {
        Swal.fire(
          "Erreur",
          "Impossible de charger les paiements effectués.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPaiements();
  }, []);
  const handleDownloadPDF = async (demande_id) => {
    try {
      await telechargerPDF(demande_id);
    } catch (error) {
      Swal.fire("Erreur", "Le téléchargement a échoué.", "error");
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "80px" },
    {
      name: "Montant (FCFA)",
      selector: (row) => row.demandes_paiement.montant,
      sortable: true,
      right: true,
    },
    {
      name: "Bénéficiaire",
      selector: (row) => row.demandes_paiement.beneficiaire,
      sortable: true,
    },
    { name: "Moyen de paiement", selector: (row) => row.moyen_paiement },
    {
      name: "Date de paiement",
      selector: (row) => new Date(row.date_paiement).toLocaleDateString(),
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDownloadPDF(row.demande_id)}
          className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          📄 Télécharger
        </button>
      ),
    },
  ];
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Historique des paiements
      </h2>
      <DataTable
        columns={columns}
        data={paiements}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
        responsive
        paginationPerPage={5}
      />
    </div>
  );
}
