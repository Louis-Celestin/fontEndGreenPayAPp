import axios from "axios";

// URL de l'API backend
const API_URL = "http://localhost:5000/api/paiements";
const API_URL_VALIDATIONS = "http://localhost:5000/api/validations";
const API_URL_DEMANDES = "http://localhost:5000/api/demandes";

// ✅ Récupérer les paiements en attente
// export const getPaiementsEnAttente = async (DAF_id) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(`${API_URL_VALIDATIONS}/en_attente/${DAF_id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data.demandes;
//   } catch (error) {
//     throw error.response?.data?.message || "Erreur lors du chargement des paiements en attente.";
//   }
// };

// // Recuperer une demande

// export const getDemandeById = async (demandeId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${API_URL_DEMANDES}/${demandeId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data?.message || "Erreur lors de la récupération de la demande";
//     }
//   };

// // ✅ Récupérer les paiements effectués
// export const getPaiementsEffectues = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(`${API_URL}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(response)
//     return response.data;
//   } catch (error) {
//     throw error.response?.data?.message || "Erreur lors du chargement des paiements effectués.";
//   }
// };

// // ✅ Effectuer un paiement
// export const effectuerPaiement = async (id, formData) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(`${API_URL}/effectuerPaiement/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data?.message || "Erreur lors du paiement.";
//     }
//   };
  

// // ✅ Reporter un paiement (mettre en "en_attente_paiement")
// export const reporterPaiement = async (demande_id, commentaire) => {
//   try {
//     const valideur_id = localStorage.getItem("user_id");
//     const token = localStorage.getItem("token");
//     const response = await axios.post(`${API_URL_VALIDATIONS}/${demande_id}/valider`, 
//       { statut: "en_attente_paiement", commentaire,  valideur_id}, 
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     return response.data;
//   } catch (error) {
//     throw error.response?.data?.message || "Erreur lors du report de paiement.";
//   }
// };

// export const telechargerPDF = async (demande_id) => {
//   try {
//     const response = await axios.get(`${API_URL}/download-pdf/${demande_id}`, {
//       responseType: "blob",
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `demande_paiement_${demande_id}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (error) {
//     console.error("❌ Erreur lors du téléchargement du PDF :", error);
//   }
// };

// import axios from "axios";

// URL de l'API backend
// const API_URL = "http://localhost:5000/api/paiements";
// const API_URL_VALIDATIONS = "http://localhost:5000/api/validations";
// const API_URL_DEMANDES = "http://localhost:5000/api/demandes";

// ✅ Récupérer les paiements en attente
export const getPaiementsEnAttente = async (DAF_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL_VALIDATIONS}/en_attente/${DAF_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.demandes;
  } catch (error) {
    console.error("Erreur lors du chargement des paiements en attente :", error);
    throw error.response?.data?.message || "Erreur lors du chargement des paiements en attente.";
  }
};

// ✅ Récupérer une demande spécifique par ID
export const getDemandeById = async (demandeId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL_DEMANDES}/${demandeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la demande :", error);
    throw error.response?.data?.message || "Erreur lors de la récupération de la demande.";
  }
};

// ✅ Récupérer les paiements effectués
export const getPaiementsEffectues = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des paiements effectués :", error);
    throw error.response?.data?.message || "Erreur lors du chargement des paiements effectués.";
  }
};

// ✅ Effectuer un paiement
export const effectuerPaiement = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/effectuerPaiement/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du paiement :", error);
    throw error.response?.data?.message || "Erreur lors du paiement.";
  }
};

// ✅ Reporter un paiement (mettre en "en_attente_paiement")
export const reporterPaiement = async (demande_id, commentaire) => {
  try {
    const valideur_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL_VALIDATIONS}/${demande_id}/valider`, 
      { statut: "en_attente_paiement", commentaire, valideur_id }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors du report de paiement :", error);
    throw error.response?.data?.message || "Erreur lors du report de paiement.";
  }
};

// ✅ Valider un paiement (statut = "paye")
export const validerPaiement = async (demande_id) => {
  try {
    const valideur_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL_VALIDATIONS}/${demande_id}/valider`, 
      { statut: "paye", valideur_id }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la validation du paiement :", error);
    throw error.response?.data?.message || "Erreur lors de la validation du paiement.";
  }
};

// ✅ Télécharger le PDF de la demande de paiement
export const telechargerPDF = async (demande_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/download-pdf/${demande_id}`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data) {
      throw new Error("Le fichier PDF est vide ou non généré.");
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `demande_paiement_${demande_id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("❌ Erreur lors du téléchargement du PDF :", error);
    throw error.response?.data?.message || "Erreur lors du téléchargement du PDF.";
  }
};


