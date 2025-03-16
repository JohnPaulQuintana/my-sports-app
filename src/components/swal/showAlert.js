import Swal from 'sweetalert2';
export function showAlert(title, text, icon = "warning", confirmButtonText = "OK") {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText,
    });
  }
  