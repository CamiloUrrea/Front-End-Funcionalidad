
function toggleSettingsMenu() {
    const menu = document.getElementById('settingsMenu');
    menu.classList.toggle('hidden');
}

function navigateToAgregarCancha() {
    window.location.href = 'agregar_cancha.html';  
}

function navigateTo(seccion) {
    alert('Funcionalidad "' + seccion + '" aún no implementada.');
}
