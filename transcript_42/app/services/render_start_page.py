from fastapi.responses import HTMLResponse
from config import GOOGLE_MAPS_API_KEY

def render_start_page(auth_url: str) -> HTMLResponse:
    return HTMLResponse(f"""
    <html>
    <head>
        <script src="https://maps.googleapis.com/maps/api/js?key={GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
        <style>
            * {{
                font-family: Arial, sans-serif;
            }}
            body {{
                background: #12141a;
                margin: 0;
                padding: 0;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                flex-direction: column;
                position: relative;
            }}
            .map-container {{
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 1;
            }}
            #map {{
                width: 100%;
                height: 100%;
                background: #1d2028;
            }}
            .container {{
                max-width: 400px;
                width: 100%;
                background: rgba(29, 32, 40, 0.45);
                backdrop-filter: blur(10px);
                border-radius: 8px;
                border: 1px solid #424242;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                padding: 32px;
                box-sizing: border-box;
                text-align: center;
                position: relative;
                z-index: 10;
            }}
            h1, h2 {{
                margin: 0;
                line-height: 1.2;
                color: white;
            }}
            h2 {{
                margin-top: 4px;
                margin-bottom: 30px;
                font-weight: normal;
            }}
            a.button {{
                display: inline-block;
                background: #00babc;
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                transition: background 0.3s;
            }}
            a.button:hover {{
                background: #009fa0;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 13px;
                color: #a0a0a0;
                text-align: center;
            }}
            .footer a {{
                color: #00babc;
                text-decoration: none;
            }}
            .footer a:hover {{
                text-decoration: underline;
            }}
            .note {{
                max-width: 400px;
                color: #cfcfcf;
                font-size: 13px;
                text-align: center;
            }}
            .note a {{
                color: #00babc;
                text-decoration: none;
            }}
            .note a:hover {{
                text-decoration: underline;
            }}
            /* Custom marker styles */
            .custom-marker {{
                background: #00babc;
                border: 2px solid #ffffff;
                border-radius: 50%;
                color: white;
                font-weight: bold;
                font-size: 14px;
                text-align: center;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 30px;
                min-height: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }}
            .custom-popup {{
                background: #1d2028;
                color: white;
                border: 1px solid #424242;
                border-radius: 4px;
                font-family: Arial, sans-serif;
            }}
            .custom-popup .leaflet-popup-content-wrapper {{
                background: #1d2028;
                color: white;
                border-radius: 4px;
            }}
            .custom-popup .leaflet-popup-content {{
                margin: 8px 12px;
                font-size: 14px;
            }}
            .custom-popup .leaflet-popup-tip {{
                background: #1d2028;
                border: 1px solid #424242;
            }}
        </style>
    </head>
    <body>
        <div class="map-container">
            <div id="map"></div>
        </div>
        
        <div class="container">
            <h1>42 Berlin</h1>
            <h2>Academic Transcript</h2>
            <a class="button" href="{auth_url}">Login with 42</a>
        </div>
        
        <div class="footer">
            <a href="https://42berlin.de/" target="_blank">42 Berlin </a>© Made by 
            <a href="https://github.com/julesrb" target="_blank">Jules Bernard</a>
        </div>

        <script>
            // City data with coordinates and values
            const cityData = [
                {{ name: "Paris", lat: 48.8566, lng: 2.3522, value: 11 }},
                {{name: "Malaga", lat: 36.7213, lng: -4.4214, value: 24 }},
                {{ name: "Wolfsburg", lat: 52.4227, lng: 10.7865, value: 3 }},
                {{ name: "Tétouan", lat: 35.5889, lng: -5.3626, value: 6 }},
                {{ name: "Heilbronn", lat: 49.1427, lng: 9.2109, value: 13 }},
                {{ name: "Berlin", lat: 52.52, lng: 13.405, value: 29 }},
                {{ name: "Khouribga", lat: 32.8847, lng: -6.9066, value: 1 }},
                {{ name: "Madrid", lat: 40.4168, lng: -3.7038, value: 3 }},
                {{ name: "Beirut", lat: 33.8938, lng: 35.5018, value: 3 }},
                {{ name: "Le Havre", lat: 49.4944, lng: 0.1079, value: 1 }},
                {{ name: "Benguerir", lat: 32.2622, lng: -7.9511, value: 1 }},
                {{ name: "Barcelona", lat: 41.3851, lng: 2.1734, value: 2 }},
                {{ name: "Amman", lat: 31.9454, lng: 35.9284, value: 1 }},
                {{ name: "Rabat", lat: 34.0209, lng: -6.8416, value: 1 }},
                {{ name: "Rome", lat: 41.9028, lng: 12.4964, value: 1 }},
                {{ name: "Quebec", lat: 46.8139, lng: -71.208, value: 1 }}
            ];

            function initMap() {{
                // Initialize Google Map with dark theme
                const map = new google.maps.Map(document.getElementById('map'), {{
                    center: {{ lat: 20, lng: 0 }},
                    zoom: 2,
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    styles: [
                        {{ elementType: 'geometry', stylers: [{{ color: '#242f3e' }}] }},
                        {{ elementType: 'labels.text.stroke', stylers: [{{ color: '#242f3e' }}] }},
                        {{ elementType: 'labels.text.fill', stylers: [{{ color: '#746855' }}] }},
                        {{
                            featureType: 'administrative.locality',
                            elementType: 'labels.text.fill',
                            stylers: [{{ color: '#d59563' }}]
                        }},
                        {{
                            featureType: 'poi',
                            elementType: 'labels.text.fill',
                            stylers: [{{ color: '#d59563' }}]
                        }},
                        {{
                            featureType: 'poi.park',
                            elementType: 'geometry',
                            stylers: [{{ color: '#263c3f' }}]
                        }},
                        {{
                            featureType: 'poi.park',
                            elementType: 'labels.text.fill',
                            stylers: [{{ color: '#6b9a76' }}]
                        }},
                        {{
                            featureType: 'road',
                            elementType: 'geometry',
                            stylers: [{{ color: '#38414e' }}]
                        }},
                        {{
                            featureType: 'road',
                            elementType: 'geometry.stroke',
                            stylers: [{{ color: '#212a37' }}]
                        }},
                        {{
                            featureType: 'road',
                            elementType: 'labels.text.fill',
                            stylers: [{{ color: '#9ca5b3' }}]
                        }},
                        {{
                            featureType: 'road.highway',
                            elementType: 'geometry',
                            stylers: [{{ color: '#746855' }}]
                        }},
                        {{
                            featureType: 'road.highway',
                            elementType: 'geometry.stroke',
                            stylers: [{{ color: '#1f2835' }}]
                        }},
                        {{
                            featureType: 'road.highway',
                            elementType: 'labels.text.fill',
                            stylers: [{{ color: '#f3d19c' }}]
                        }},
                        {{
                            featureType: 'transit',
                            elementType: 'geometry',
                            stylers: [{{ color: '#2f3948' }}]
                        }},
                        {{
                            featureType: 'transit.station',
                            elementType: 'labels.text.fill',
                            stylers: [{{ color: '#d59563' }}]
                        }},
                        {{
                            featureType: 'water',
                            elementType: 'geometry',
                            stylers: [{{ color: '#17263c' }}]
                        }},
                        {{
                            featureType: 'water',
                            elementType: 'labels.text.fill',
                            stylers: [{{ color: '#515c6d' }}]
                        }},
                        {{
                            featureType: 'water',
                            elementType: 'labels.text.stroke',
                            stylers: [{{ color: '#17263c' }}]
                        }}
                    ]
                }});

                // Add city markers
                cityData.forEach(city => {{
                    const marker = new google.maps.Marker({{
                        position: {{ lat: city.lat, lng: city.lng }},
                        map: map,
                        icon: {{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 15,
                            fillColor: '#00babc',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2
                        }},
                        label: {{
                            text: city.value.toString(),
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                    }});

                    const infoWindow = new google.maps.InfoWindow({{
                        content: `
                            <div style="color: #000; font-family: Arial, sans-serif;">
                                <strong>${{city.name}}</strong><br>
                                Value: <strong>${{city.value}}</strong>
                            </div>
                        `
                    }});

                    marker.addListener('click', () => {{
                        infoWindow.open(map, marker);
                    }});
                }});
            }}
        </script>
    </body>
    </html>
    """)