const randomCode = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const formulario = document.querySelector('#productForm');
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = new FormData(formulario);
    fetch('/api/products', {
        method: 'POST',
        body: product,
        
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            if (data.id){

                window.location.href = `/products/${data.id}`;
            }
        }
    })
    .catch(err => console.log(err));
});