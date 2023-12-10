import Swal from 'sweetalert2';

const mixin = Swal.mixin({
  cancelButtonText: 'Batal',
  cancelButtonColor: '#AAAAAA',
  confirmButtonColor: '#1560BD',
});

export default mixin;