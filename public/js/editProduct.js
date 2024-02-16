const formEdit = document.getElementById('productForm');
formEdit.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = formEdit.id.value;
    const product = JSON.stringify(Object.fromEntries(new FormData(formEdit)));
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: product
        });
        if (response.ok) {
            window.location.href = `/products/${id}`;
        }
    }
    catch (error) {
        console.log(error);
    }
});