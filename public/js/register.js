const formRegister = document.getElementById('registerForm');

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = document.querySelectorAll('.response');
    response.forEach((res) => {
        res.remove();
    });
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const age = document.getElementById('age').value;
    const data = { first_name, last_name, email, password, age };
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();
        if (json.status === 'success') {
            window.location.href = '/login';
        } else {
            if (json.input) {
                const input = document.getElementById(json.input);
                let html = `<div class="alert alert-danger m-1 response">${json.message}</div>`;
                input.insertAdjacentHTML('afterend', html);
                input.focus();
            } else {
                let html = `<div class="alert alert-danger m-1 response">${json.message}</div>`;
                formRegister.insertAdjacentHTML('afterbegin', html);
            }
        }
    } catch (error) {
        console.log(error);
        let html = `<div class="alert alert-danger m-1 response">Hubo un error, intente nuevamente</div>`;
        formRegister.insertAdjacentHTML('afterbegin', html);
    }
    
});