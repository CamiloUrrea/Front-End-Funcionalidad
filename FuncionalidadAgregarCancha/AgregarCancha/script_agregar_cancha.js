
window.onload = function () {
    const diasContainer = document.getElementById("diasContainer");
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    dias.forEach(dia => {
        const div = document.createElement("div");
        div.className = "dia";
        div.innerHTML = `
            <label class="dia-nombre">${dia}</label>
            <div class="cerrado-linea">
                <span class="cerrado-texto">Cerrado</span>
                <input type="checkbox" id="${dia}_cerrado" name="${dia}_cerrado" onchange="toggleHorario('${dia}', this.checked)">
            </div>
            <input type="time" name="${dia}_apertura" required>
            <input type="time" name="${dia}_cierre" required>
        `;
        diasContainer.appendChild(div);
    });

    document.getElementById("canchaForm").onsubmit = function (e) {
        e.preventDefault();
        const horarioInputs = document.querySelectorAll(".dias-container input");
        for (let input of horarioInputs) {
            if (!input.value) {
                alert("Debe completar todos los horarios de la semana.");
                return;
            }
        }
        for (let dia of dias) {
        const cerrado = document.querySelector(`input[name='${dia}_cerrado']`).checked;

            if (!cerrado) {
                const apertura = document.querySelector(`input[name='${dia}_apertura']`).value;
                const cierre = document.querySelector(`input[name='${dia}_cierre']`).value;

                if (!apertura || !cierre) {
                    alert(`Debe completar los horarios del día ${dia}.`);
                    return;
                }
                if (apertura >= cierre) {
                    alert(`La hora de cierre debe ser posterior a la de apertura en ${dia}.`);
                    return;
                }
            }
        }

        const largos = document.querySelector("input[name='largo']").value;
        const anchos = document.querySelector("input[name='ancho']").value;
        if (largos <= 0 || anchos <= 0) {
            alert("Las dimensiones deben ser mayores que cero.");
            return;
        }

        alert("Cancha agregada exitosamente");
        // En esta parte para conectar con el BackEnd
    };
};

function toggleHorario(dia, cerrado) {
    const apertura = document.querySelector(`input[name='${dia}_apertura']`);
    const cierre = document.querySelector(`input[name='${dia}_cierre']`);

    if (cerrado) {
        apertura.value = "00:00";
        cierre.value = "00:00";
        apertura.disabled = true;
        cierre.disabled = true;
    } else {
        apertura.disabled = false;
        cierre.disabled = false;
        apertura.value = "";
        cierre.value = "";
    }
}

function cancelar() {
    window.location.href = "../organizacion_deportiva.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // Mapa Leaflet para seleccionar coordenadas
    let map = L.map('map').setView([6.2442, -75.5812], 13); // Medellín como punto inicial

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let marker;

    map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        document.getElementById('latitud').value = lat.toFixed(6);
        document.getElementById('longitud').value = lng.toFixed(6);

        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
        // Reverse geocoding con Nominatim
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    .then(response => response.json())
    .then(data => {
        const country = data.address.country;
        const department = data.address.state;
        const municipality = data.address.city || data.address.town || data.address.village;

        if (country !== "Colombia") {
            alert("Por favor seleccione una ubicación dentro de Colombia.");
            return;
        }

        document.getElementById("departamento").value = department;
        document.getElementById("municipio").value = municipality;

        const municipioSelect = document.getElementById("municipio");
        municipioSelect.innerHTML = `<option value="${municipality}">${municipality}</option>`;
    })
    .catch(err => {
        console.error("Error al obtener la ubicación:", err);
    });
        });
});


