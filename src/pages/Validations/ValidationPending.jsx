import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheck, FaTimesCircle, FaInfo } from "react-icons/fa";
import { getDemandesEnAttente, validerDemande, rejeterDemande } from "../../services/validationsServices/validationServices";
import { ClipLoader } from "react-spinners"; // ✅ Ajout du loader
import PageMeta from "../../components/common/PageMeta";

export default function ValidationsPending() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // ✅ Loader pour actions
  const utilisateurId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  // Filtres
  const [filtreStatut, setFiltreStatut] = useState("");
  const [filtreBenef, setFiltreBenef] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const response = await getDemandesEnAttente(utilisateurId);
      let filtered = response;

      if (filtreStatut) filtered = filtered.filter((d) => d.statut === filtreStatut);
      if (filtreBenef) filtered = filtered.filter((d) => d.beneficiaire.toLowerCase().includes(filtreBenef.toLowerCase()));
      if (startDate) filtered = filtered.filter((d) => new Date(d.date_creation) >= new Date(startDate));
      if (endDate) filtered = filtered.filter((d) => new Date(d.date_creation) <= new Date(endDate));

      setDemandes(filtered);
    } catch (error) {
      Swal.fire("Erreur", "Impossible de charger les demandes en attente.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
    // eslint-disable-next-line
  }, [filtreStatut, filtreBenef, startDate, endDate]);

  const handleValidation = async (id) => {
    setActionLoading(true); // ✅ Début du loader action
    try {
      await validerDemande(id, utilisateurId);
      await fetchDemandes();
      Swal.fire("✅ Validée", "La demande a été approuvée.", "success");
    } catch {
      Swal.fire("❌ Erreur", "Impossible de valider la demande.", "error");
    } finally {
      setActionLoading(false); // ✅ Fin du loader action
    }
  };

  const handleRejet = async (id) => {
    const { value: commentaire } = await Swal.fire({
      title: "Rejeter la demande",
      input: "textarea",
      inputLabel: "Commentaire",
      inputPlaceholder: "Motif du rejet...",
      showCancelButton: true,
    });

    if (commentaire) {
      setActionLoading(true); // ✅ Début du loader action
      try {
        await rejeterDemande(id, utilisateurId, commentaire);
        await fetchDemandes();
        Swal.fire("🚫 Rejetée", "La demande a été rejetée.", "success");
      } catch {
        Swal.fire("❌ Erreur", "Échec du rejet de la demande.", "error");
      } finally {
        setActionLoading(false); // ✅ Fin du loader action
      }
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "60px", sortable: true },
    { name: "Montant", selector: (row) => `${row.montant} FCFA`, sortable: true },
    { name: "Bénéficiaire", selector: (row) => row.beneficiaire, sortable: true },
    {
      name: "Statut",
      cell: (row) => (
        <span className={`px-2 py-1 rounded text-sm ${
          row.statut === "rejete" ? "bg-red-100 text-red-600" :
          row.statut.includes("validation") ? "bg-yellow-100 text-yellow-700" :
          "bg-gray-100 text-gray-600"
        }`}>
          {row.statut}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => navigate(`/validations/${row.id}`)}
            title="Voir"
          >
            <FaInfo />
          </button>
          <button
            className="text-green-500 hover:text-green-700"
            onClick={() => handleValidation(row.id)}
            title="Valider"
          >
            <FaCheck />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleRejet(row.id)}
            title="Rejeter"
          >
            <FaTimesCircle />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <PageMeta title="Demandes en attente de validation" description="Liste des demandes en attente de validation" />
    <div className="relative max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded">
      {actionLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <ClipLoader color="#0d6efd" loading={actionLoading} size={50} />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Demandes en attente de validation</h2>

      {/* 🔍 Filtres */}
      <div className="bg-gray-50 p-4 rounded mb-4 grid md:grid-cols-3 gap-4">
        <div>
          <label>Statut</label>
          <select className="w-full border p-2 rounded" value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
            <option value="">-- Tous --</option>
            <option value="validation_section">Validation Section</option>
          </select>
        </div>
        <div>
          <label>Bénéficiaire</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={filtreBenef}
            onChange={(e) => setFiltreBenef(e.target.value)}
            placeholder="Filtrer par bénéficiaire"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1 font-semibold">Date début</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="w-full p-2 border rounded"
              dateFormat="yyyy-MM-dd"
              placeholderText="Sélectionner une date"
              isClearable
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Date fin</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="w-full p-2 border rounded"
              dateFormat="yyyy-MM-dd"
              placeholderText="Sélectionner une date"
              isClearable
            />
          </div>
        </div>
      </div>

      {/* 📄 Tableau */}
      <DataTable
        columns={columns}
        data={demandes}
        progressPending={loading}
        pagination
        paginationPerPage={5}
        highlightOnHover
        striped
        responsive
      />
    </div>
    </>
  );
}
