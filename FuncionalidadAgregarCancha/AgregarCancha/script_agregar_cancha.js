// Constantes globales
const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// Inicialización de la interfaz
window.onload = () => {
    generarHorarios();
    configurarFormulario();
};

// Generar campos de horarios con check de cerrado
function generarHorarios() {
    const container = document.getElementById("diasContainer");

    dias.forEach(dia => {
        const div = document.createElement("div");
        div.className = "dia";
        div.innerHTML = `
            <label class="dia-nombre">${dia}</label>
            <div class="cerrado-linea">
                <input type="checkbox" id="${dia}_cerrado" onchange="toggleHorario('${dia}', this.checked)">
                <span class="cerrado-texto">Cerrado</span>
            </div>
            <input type="time" name="${dia}_apertura" required>
            <input type="time" name="${dia}_cierre" required>
        `;
        container.appendChild(div);
    });
}

// Configurar validaciones y comportamiento del formulario
function configurarFormulario() {
    const form = document.getElementById("canchaForm");
    form.onsubmit = (e) => {
        e.preventDefault();

        if (!validarHorarios()) return;
        if (!validarDimensiones()) return;
        if (!validarDireccion()) return;

        alert("Cancha agregada exitosamente");
        // Aquí iría el llamado al backend
    };
}

// Validar horarios
function validarHorarios() {
    for (let dia of dias) {
        const cerrado = document.getElementById(`${dia}_cerrado`).checked;
        const apertura = document.querySelector(`input[name='${dia}_apertura']`);
        const cierre = document.querySelector(`input[name='${dia}_cierre']`);

        if (!cerrado) {
            if (!apertura.value || !cierre.value) {
                alert(`Debe completar los horarios del día ${dia}.`);
                return false;
            }
            if (apertura.value >= cierre.value) {
                alert(`La hora de cierre debe ser posterior a la de apertura en ${dia}.`);
                return false;
            }
        }
    }
    return true;
}

// Validar dimensiones
function validarDimensiones() {
    const largo = document.querySelector("input[name='largo']").value;
    const ancho = document.querySelector("input[name='ancho']").value;

    if (largo <= 0 || ancho <= 0) {
        alert("Las dimensiones deben ser mayores que cero.");
        return false;
    }
    return true;
}

// Validar formato de dirección colombiana
function validarDireccion() {
    const direccion = document.getElementById("direccion").value;
    const formato = /^(?:(?:cra|cl|av|tv|diagonal)\s?\d+[a-zA-Z]?(?:\s?(?:sur|norte))?\s?#\d+[a-zA-Z]?-?\d+)(?:\s?(int|apto|torre)\s?\d+)?$/i;

    if (!formato.test(direccion)) {
        alert("Por favor ingrese una dirección válida en formato colombiano. Ej: Cra 19 #25-75 int 218");
        return false;
    }
    return true;
}

// Alternar estado de horarios según casilla Cerrado
function toggleHorario(dia, cerrado) {
    const apertura = document.querySelector(`input[name='${dia}_apertura']`);
    const cierre = document.querySelector(`input[name='${dia}_cierre']`);

    apertura.disabled = cerrado;
    cierre.disabled = cerrado;
    apertura.value = cerrado ? "00:00" : "";
    cierre.value = cerrado ? "00:00" : "";
}

// Volver a la página anterior
function cancelar() {
    window.location.href = "../organizacion_deportiva.html";
}

// Configurar Leaflet y geolocalización
document.addEventListener("DOMContentLoaded", () => {
    const map = L.map("map").setView([6.2442, -75.5812], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        document.getElementById("latitud").value = lat.toFixed(6);
        document.getElementById("longitud").value = lng.toFixed(6);

        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(res => res.json())
            .then(data => {
                const { country, state, city, town, village } = data.address;
                if (country !== "Colombia") {
                    alert("Por favor seleccione una ubicación dentro de Colombia.");
                    return;
                }
                document.getElementById("departamento").value = state;
                document.getElementById("municipio").value = city || town || village || "";
            })
            .catch(err => console.error("Error al obtener la ubicación:", err));
    });
});
