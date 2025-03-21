import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

export default function DashboardAgent() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/demandes/stats/Agent", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Erreur de chargement :", error));
  }, []);

  if (!stats) return <p className="text-center">Chargement...</p>;

  // ✅ Options du Camembert (Répartition des montants)
  const pieOptions = {
    labels: ["Montant Total Demandes", "Montant Total Paiements Reçus"],
    colors: ["#F97316", "#10B981"],
    legend: { position: "bottom" },
  };

  const pieSeries = [
    parseFloat(stats.montantTotalDemandes),
    parseFloat(stats.montantTotalPaiementsRecus),
  ];

  // ✅ Options du Bar Chart (Évolution des demandes)
  const barOptions = {
    colors: ["#3B82F6"],
    chart: { type: "bar", height: 200, toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: "50%", borderRadius: 5 } },
    xaxis: { categories: ["Demandes Approuvées", "Demandes Rejetées"] },
    yaxis: { labels: { formatter: (val) => `${val}` } },
  };

  const barSeries = [
    {
      name: "Nombre",
      data: [stats.nbDemandesApprouvees, stats.nbDemandesRejetees],
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Tableau de bord - Agent
      </h2>

      {/* ✅ Cartes Résumé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-100 rounded-lg text-center">
          <p className="text-gray-700">Total Demandes</p>
          <h3 className="text-xl font-bold">{stats.nbDemandes}</h3>
        </div>
        <div className="p-4 bg-green-100 rounded-lg text-center">
          <p className="text-gray-700">Demandes Approuvées</p>
          <h3 className="text-xl font-bold">{stats.nbDemandesApprouvees}</h3>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg text-center">
          <p className="text-gray-700">Montant Total Demandes</p>
          <h3 className="text-xl font-bold">{stats.montantTotalDemandes} FCFA</h3>
        </div>
        <div className="p-4 bg-green-200 rounded-lg text-center">
          <p className="text-gray-700">Montant Total Paiements Reçus</p>
          <h3 className="text-xl font-bold">{stats.montantTotalPaiementsRecus} FCFA</h3>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg text-center">
          <p className="text-gray-700">Paiements Reçus</p>
          <h3 className="text-xl font-bold">{stats.nbPaiementsRecus}</h3>
        </div>
        <div className="p-4 bg-red-100 rounded-lg text-center">
          <p className="text-gray-700">Demandes Rejetées</p>
          <h3 className="text-xl font-bold">{stats.nbDemandesRejetees}</h3>
        </div>
      </div>

      {/* ✅ Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Évolution des Demandes
          </h3>
          <Chart options={barOptions} series={barSeries} type="bar" height={200} />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            Répartition des Montants
          </h3>
          <Chart options={pieOptions} series={pieSeries} type="pie" height={200} />
        </div>
      </div>
    </div>
  );
}
