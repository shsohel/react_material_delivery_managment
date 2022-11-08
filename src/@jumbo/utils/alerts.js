import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SweetAlerts = withReactContent(Swal);

export const toastAlerts = (variant: 'success' | 'error' | 'warning' | 'info' | 'question', message) => {
  const Toast = SweetAlerts.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      container: 'abc'
    },
    onOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: variant,
    title: message
  });
};

export const sweetAlerts = (iconType: 'success' | 'error' | 'warning' | 'info' | 'question', title, text) => {
  SweetAlerts.fire({
    icon: iconType,
    title: title,
    text: text
  });
};
