// Utilidades para manejar tokens de autenticación en el almacenamiento local
export const saveTokens = ({ access_token, refresh_token }) => {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
};
 
// Guarda información del empleado en el almacenamiento local
export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};
 
// Recupera el token de acceso desde el almacenamiento local
export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

// Recupera el token de actualización desde el almacenamiento local
export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("empleado");
};