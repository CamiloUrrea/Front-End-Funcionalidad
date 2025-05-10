
const departamentos = {
    "Antioquia": ["Medellín", "Envigado", "Bello"],
    "Cundinamarca": ["Bogotá", "Soacha", "Chía"],
    "Valle del Cauca": ["Cali", "Palmira", "Tuluá"]
};

window.onload = function () {
    const depSelect = document.getElementById("departamento");
    const munSelect = document.getElementById("municipio");
    const diasContainer = document.getElementById("diasContainer");

    for (let dep in departamentos) {
        let option = document.createElement("option");
        option.value = dep;
        option.textContent = dep;
        depSelect.appendChild(option);
    }

    depSelect.onchange = () => {
        munSelect.innerHTML = "";
        departamentos[depSelect.value].forEach(mun => {
            let opt = document.createElement("option");
            opt.value = mun;
            opt.textContent = mun;
            munSelect.appendChild(opt);
        });
    };
    depSelect.dispatchEvent(new Event("change"));

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    dias.forEach(dia => {
        const div = document.createElement("div");
        div.className = "dia";
        div.innerHTML = `
            <label>${dia}</label>
            Apertura: <input type="time" name="${dia}_apertura" required>
            Cierre: <input type="time" name="${dia}_cierre" required>
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
        alert("Cancha agregada exitosamente");
    };
};

function cancelar() {
    window.location.href = "index.html";
}
