// src/utils/alerts.js
import Swal from 'sweetalert2';

/**
 * Muestra una alerta personalizada con ícono, título y mensaje.
 * @param {'success' | 'error' | 'warning' | 'info' | 'question'} type
 * @param {string} title
 * @param {string} text
 * @param {string} confirmButtonText
 */
export const showAlert = (
  type = 'info',
  title = 'Alerta',
  text = '',
  confirmButtonText = 'Aceptar'
) => {
  Swal.fire({
    icon: type,
    title,
    text,
    confirmButtonText
  });
};

export const showAlertWithTimer = (
  type = 'info',
  title = 'Alerta',
  text = '',
  confirmButtonText = 'Aceptar'
) => {
  Swal.fire({
    icon: type,
    title,
    text,
    confirmButtonText,
    timer: 8000,
    timerProgressBar: true
  });
};

/**
 * Alerta de confirmación que retorna una promesa (true si confirma)
 */
export const alertConfirm = async (
  title = '¿Estás seguro?',
  text = 'Esta acción no se puede deshacer.'
) => {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: '#198754',
    cancelButtonColor: '#dc3545',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  });
};
