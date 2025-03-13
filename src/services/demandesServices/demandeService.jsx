import axios from "axios";

// 🔹 Définition de l'URL de base de l'API
const API_URL = "http://localhost:5000/api/demandes"; 

// ✅ Créer une demande de paiement
// export const createDemande = async (formData) => {
//   try {
//     const token = localStorage.getItem("token");

//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data", // Nécessaire pour envoyer des fichiers
//         Authorization: `Bearer ${token}`,
//       },
//     };

//     // 🔹 Création d'un objet FormData pour gérer les fichiers
//     const data = new FormData();
//     data.append("agent_id", formData.agent_id);
//     data.append("montant", formData.montant);
//     data.append("motif", formData.motif);
//     data.append("beneficiaire", formData.beneficiaire);
//     data.append("requiert_proforma", formData.requiert_proforma);
    
    
//     if (formData.proforma) {
//       data.append("proforma", formData.proforma); // Ajout du fichier si présent
//     }

//     const response = await axios.post(`${API_URL}/createDemandePaiement`, data, config);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data?.message || "Erreur lors de la création de la demande";
//   }
// };

export const createDemande = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/createDemandePaiement`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // ✅ Indiquer qu'on envoie un fichier
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Erreur lors de la création de la demande";
    }
  };
  

// ✅ Récupérer toutes les demandes
export const getDemandes = async (utilisateur_id, page) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.get(`${API_URL}/getDemandePaiement`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { utilisateur_id, page },
      });
  
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Erreur lors de la récupération des demandes";
    }
  };

// ✅ Obtenir une demande spécifique
export const getDemandeById = async (demandeId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/${demandeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la récupération de la demande";
  }
};

// ✅ Modifier une demande
export const updateDemande = async (demandeId, updatedData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/${demandeId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la modification de la demande";
  }
};

// ✅ Supprimer (soft delete) une demande
export const deleteDemande = async (demandeId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/${demandeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { message: "Demande supprimée avec succès" };
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la suppression de la demande";
  }
};
