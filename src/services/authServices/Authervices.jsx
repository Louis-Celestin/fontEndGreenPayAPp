import axios from "axios";

// URL de base de l'API backend
const API_URL = "http://localhost:5000/api/auth";

// ✅ Fonction de connexion
export const login = async (email, mot_de_passe) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, mot_de_passe });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Stocker le token
      localStorage.setItem("agent_id", response.data.user.agent_id);
      localStorage.setItem("user_id", response.data.user.id);
      localStorage.setItem("role", response.data.user.agents.fonction);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur de connexion";
  }
};

// ✅ Fonction d'inscription
export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de l'inscription";
  }
};

// ✅ Fonction de déconnexion
export const logout = () => {
  localStorage.clear()
};

// ✅ Vérification si l'utilisateur est connecté
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null && token !== undefined;
};

// ✅ Fonction pour demander la réinitialisation du mot de passe (Forgot Password)
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data; // Renvoie le message de confirmation
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la demande de réinitialisation";
  }
};

// ✅ Fonction pour réinitialiser le mot de passe avec le token (Reset Password)
export const resetPassword = async (token, mot_de_passe) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, { mot_de_passe });
    return response.data; // Renvoie le message de confirmation
  } catch (error) {
    throw error.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe";
  }
};
