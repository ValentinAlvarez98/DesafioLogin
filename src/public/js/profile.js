const form = document.getElementById('profileForm');

form.addEventListener('submit', (e) => {

      e.preventDefault();

      const data = new FormData(form);

      const obj = {}

      data.forEach((value, key) => {
            obj[key] = ['email', 'first_name', 'last_name'].includes(key) ? value.toLowerCase() : value;
      });

      fetch('/api/sessions/profile', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                  'Content-Type': 'application/json'
            }
      }).then(result => {
            if (result.status === 200) {
                  alert('Perfil actualizado correctamente');
                  window.location.href = '/profile';
            } else {
                  alert('Error al actualizar el perfil');
            };
      })

});