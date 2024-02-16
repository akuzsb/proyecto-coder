const select = document.getElementById('orderBy');
select.addEventListener('change', () => {
    const orderBy = select.value;
    window.location.href = `/products?orderBy=${orderBy}`;
});