const btnEliminar = document.getElementById('btnEliminar');

btnEliminar.addEventListener('click', () => {
    const id = btnEliminar.dataset.id;
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        fetch(`/api/products/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    window.location.href = '/products';
                }
            });
    }
});