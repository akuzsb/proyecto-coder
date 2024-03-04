const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // limpio los mensajes anteriores de .response
    const response = document.querySelectorAll('.response');
    response.forEach((res) => {
        res.remove();
    });
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = { email, password };
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        // mostrar por consola el mensaje de respuesta
        const json = await response.json();
        if (json.status === 'success') {
            window.location.href = '/';
        } else {
            // si incluye el input en el json, mostrar el mensaje en el input correspondiente
            if (json.input) {
                const input = document.getElementById(json.input);
                let html = `<div class="alert alert-danger m-1 response">${json.message}</div>`;
                input.insertAdjacentHTML('afterend', html);
                input.focus();
            } else {
                let html = `<div class="alert alert-danger m-1 response">${json.message}</div>`;
                loginForm.insertAdjacentHTML('afterbegin', html);
            }
        }
    } catch (error) {
        console.log(error);
        // si hay un error, mostrarlo en un alert antes del submit
        let html = `<div class="alert alert-danger m-1 response">Hubo un error, intente nuevamente</div>`;
        loginForm.insertAdjacentHTML('afterbegin', html);
    }

});
