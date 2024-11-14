// Definición de capas de mapas con diferentes estilos
var openStreetMapStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var openStreetMapTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a>'
});

var openStreetMapHot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/">Humanitarian OpenStreetMap Team</a>'
});

// Inicializa el mapa en una ubicación predeterminada (San Francisco, por ejemplo) con la capa de mapa estándar
var map = L.map('map', {
    center: [37.7749, -122.4194], // San Francisco, California
    zoom: 13,
    layers: [openStreetMapStandard] // Capa inicial
});

// Agrega el control de capas para permitir alternar entre diferentes mapas base
var baseMaps = {
    "Estándar": openStreetMapStandard,
    "Topográfico": openStreetMapTopo,
    "Humanitario": openStreetMapHot
};

L.control.layers(baseMaps).addTo(map);

// Función para buscar la ciudad y actualizar el mapa
function buscarCiudad() {
    const ciudad = document.getElementById('city-input').value;

    if (ciudad) {
        // Llama a la función de eel para obtener el clima
        eel.obtener_datos_clima(ciudad)(function (datos) {
            // Actualiza la información del clima en la interfaz
            document.getElementById('temperature').textContent = `${datos.temperatura}°C`;
            document.getElementById('description').textContent = datos.descripcion;

            // Usa la API de Nominatim (OpenStreetMap) para obtener coordenadas de la ciudad
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${ciudad}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = data[0].lat;
                        const lon = data[0].lon;

                        // Mueve el mapa a la ubicación de la ciudad
                        map.setView([lat, lon], 13);

                        // Agrega un marcador en la ubicación de la ciudad
                        L.marker([lat, lon]).addTo(map)
                            .bindPopup(`<b>${datos.ciudad}</b><br>${datos.descripcion}`)
                            .openPopup();
                    } else {
                        alert("No se encontró la ciudad. Intenta con otro nombre.");
                    }
                })
                .catch(error => console.error('Error al obtener coordenadas:', error));
        });
    } else {
        alert("Por favor, ingresa una ciudad.");
    }
}
