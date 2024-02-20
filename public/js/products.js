const select = document.getElementById('orderBy');
select.addEventListener('change', () => {
    const orderBy = select.value;
    window.location.href = `/products?order=${orderBy}`;
});

const limit = document.getElementById('limit');
limit.addEventListener('change', () => {
    const limitBy = limit.value;
    const orderBy = select.value;
    window.location.href = `/products?limit=${limitBy}&order=${orderBy}`;
});