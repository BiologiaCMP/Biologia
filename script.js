
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('show');
}
