import eel
import requests

# Coloca tu API Key de OpenWeatherMap aquí
API_KEY = 'TU_API_KEY_DE_OPENWEATHER'
BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'

# Inicializar Eel con la carpeta 'web' donde están los archivos HTML
eel.init('web')


@eel.expose
def obtener_datos_clima(ciudad):
    # Crear la URL de la solicitud a la API de OpenWeatherMap
    url = f"{BASE_URL}?q={ciudad}&appid={API_KEY}&units=metric&lang=es"

    # Realizar la solicitud a la API
    response = requests.get(url)
    data = response.json()

    if response.status_code == 200:
        # Extraer los datos necesarios del JSON de respuesta
        clima_datos = {
            "ciudad": data['name'],
            "temperatura": data['main']['temp'],
            "descripcion": data['weather'][0]['description'].capitalize(),
            "pronostico": [
                {"hora": "Ahora", "temperatura": data['main']['temp'], "descripcion": data['weather'][0]['description']}
            ]
        }
    else:
        # En caso de error (por ejemplo, ciudad no encontrada)
        clima_datos = {
            "ciudad": "No encontrada",
            "temperatura": "--",
            "descripcion": "Ciudad no encontrada",
            "pronostico": []
        }

    return clima_datos


# Iniciar la interfaz de Eel
eel.start('index.html', size=(400, 700))
