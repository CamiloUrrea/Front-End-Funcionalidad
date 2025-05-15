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

// Validar dirección completa (urbana o rural)
function validarDireccion() {
    const via = document.getElementById("viaBase").value.trim();
    const numero = document.getElementById("numeroResidencia").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();

    const direccion = `${via} ${numero}, ${ubicacion}`;

    // Detectar zona rural si el tipo de vía no comienza con una palabra urbana conocida
    const esZonaRural = !/^(Calle|Carrera|Avenida|Diagonal|Transversal)/i.test(via);

    const formatoUrbano = /^(Calle|Carrera|Avenida|Diagonal|Transversal)\s\d{1,3}[A-Z]{0,2}\s?#\d{1,4}[A-Z]?-?\d{1,4},\s?[\w\sáéíóúÁÉÍÓÚñÑ]+,\s?[\w\sáéíóúÁÉÍÓÚñÑ]+$/i;

    if (!formatoUrbano.test(direccion)) {
        if (esZonaRural) {
            if (numero.length < 2) {
                alert("Por favor agregue una descripción mínima para la zona rural. Ej: s/n, entrada por puente, referencia local.");
                return false;
            }
            const confirmacion = confirm(`La dirección registrada será:\n\n${direccion}\n\n¿Desea continuar?`);
            if (!confirmacion) return false;
        } else {
            alert("Por favor ingrese una dirección válida. Ej: Calle 82AA #25-30, Medellín, Antioquia");
            return false;
        }
    } else {
        const confirmacion = confirm(`La dirección parece válida:\n\n${direccion}\n\n¿Desea continuar con esta dirección?`);
        if (!confirmacion) return false;
    }

    document.getElementById("direccion").value = direccion;
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

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(res => res.json())
            .then(data => {
                const { country, state, city, town, village, road, neighbourhood } = data.address;

                if (country !== "Colombia") {
                    alert("Por favor seleccione una ubicación dentro de Colombia.");

                    // Limpiar campos
                    document.getElementById("latitud").value = "";
                    document.getElementById("longitud").value = "";
                    document.getElementById("departamento").value = "";
                    document.getElementById("municipio").value = "";
                    document.getElementById("viaBase").value = "";
                    document.getElementById("ubicacion").value = "";
                    document.getElementById("numeroResidencia").placeholder = "#25-30";
                    document.getElementById("numeroResidencia").dataset.rural = "false";

                    if (marker) {
                        map.removeLayer(marker);
                        marker = null;
                    }

                    return;
                }

                const municipio = city || town || village || "";
                const viaBase = road || neighbourhood || data.name || "Zona rural";
                const ubicacion = `${municipio}, ${state || ""}`;

                // Determinar si es zona rural por ausencia de vía urbana común
                const esZonaRural = !/^(Calle|Carrera|Avenida|Diagonal|Transversal)/i.test(viaBase);

                // Llenar campos individuales
                document.getElementById("latitud").value = lat.toFixed(6);
                document.getElementById("longitud").value = lng.toFixed(6);
                document.getElementById("departamento").value = state;
                document.getElementById("municipio").value = municipio;
                document.getElementById("viaBase").value = viaBase;
                document.getElementById("ubicacion").value = ubicacion;

                document.getElementById("numeroResidencia").placeholder = esZonaRural
                    ? "Ej: s/n o referencia local"
                    : "#25-30";
                document.getElementById("numeroResidencia").dataset.rural = esZonaRural;

                if (marker) {
                    marker.setLatLng([lat, lng]);
                } else {
                    marker = L.marker([lat, lng]).addTo(map);
                }
            })
            .catch(err => console.error("Error al obtener la ubicación:", err));

    });
});
