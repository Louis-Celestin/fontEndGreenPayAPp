import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getValidationsByDemande } from "../../services/validationsServices/validationServices";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle, FaTimesCircle, FaInfo } from "react-icons/fa";
import API_URL from "../../config/url";

export default function ValidationsDone() {
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const [filtreMotif, setFiltreMotif] = useState("");
  const [filtreBenef, setFiltreBenef] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  const utilisateur_id = localStorage.getItem("user_id");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getValidationsByDemande(utilisateur_id);
      setValidations(response);
      setFilteredData(response);
    } catch (error) {
      Swal.fire("Erreur", "Impossible de charger les validations.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔎 Appliquer les filtres
  useEffect(() => {
    let filtered = validations;
    console.log(filtered)

    if (filtreMotif)
      filtered = filtered.filter((v) =>
        v.demandes_paiement.motif.toLowerCase().includes(filtreMotif.toLowerCase())
      );

    if (filtreBenef)
      filtered = filtered.filter((v) =>
        v.demandes_paiement.beneficiaire.toLowerCase().includes(filtreBenef.toLowerCase())
      );

    if (filtreStatut)
      filtered = filtered.filter((v) => v.statut === filtreStatut);

    if (startDate)
      filtered = filtered.filter((v) => new Date(v.date_validation) >= startDate);

    if (endDate)
      filtered = filtered.filter((v) => new Date(v.date_validation) <= endDate);

    setFilteredData(filtered);
  }, [filtreMotif, filtreBenef, filtreStatut, startDate, endDate, validations]);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.demandes_paiement.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Motif",
      selector: (row) => row.demandes_paiement.motif,
    },
    {
      name: "Montant",
      selector: (row) => `${row.demandes_paiement.montant} FCFA`,
    },
    {
      name: "Bénéficiaire",
      selector: (row) => row.demandes_paiement.beneficiaire,
    },
    {
      name: "Statut",
      selector: (row) => row.statut,
      cell: (row) => (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
          row.statut === "approuve" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.statut === "approuve" ? <FaCheckCircle className="inline mr-1" /> : <FaTimesCircle className="inline mr-1" />}
          {row.statut}
        </span>
      ),
    },
    {
      name: "Date validation",
      selector: (row) => new Date(row.date_validation).toLocaleDateString("fr-FR"),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => navigate(`/demandes/${row.demande_id}`)}
          title="Voir la demande"
        >
          <FaInfo />
        </button>
      ),
      width: "80px",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Liste des validations effectuées
      </h2>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Motif"
          value={filtreMotif}
          onChange={(e) => setFiltreMotif(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Bénéficiaire"
          value={filtreBenef}
          onChange={(e) => setFiltreBenef(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Tous les statuts</option>
          <option value="approuve">Approuvé</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      {/* Filtres par date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Date de début</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded"
            placeholderText="Sélectionner"
            isClearable
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date de fin</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full p-2 border rounded"
            placeholderText="Sélectionner"
            isClearable
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={loading}
        pagination
        paginationPerPage={5}
        highlightOnHover
        striped
        responsive
      />
    </div>
  );
}
