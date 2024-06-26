# %%
#!python3 -m pip install folium

# %%
#!python3 -m pip install git+https://github.com/deton/folium_tripslayer.git

# %%
import folium
import folium.plugins
from folium_tripslayer import TripsLayer

m = folium.Map(location=[36.72, -4.43], zoom_start=14)

geojson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            "name": "car origin point",
            "times": [
                "2019-11-23 10:51:06"
            ],
            "icon": "circle",
            "iconstyle": {
                "color": "yellow",
                "radius": 4
            }
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -4.4214296, 36.73835 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "car",
            "times": [
                "2019-11-23 10:51:06",
                "2019-11-23 10:52:05",
                "2019-11-23 10:53:05",
                "2019-11-23 10:54:04",
                "2019-11-23 10:55:05",
                "2019-11-23 10:56:05",
                "2019-11-23 10:57:05",
                "2019-11-23 10:58:05",
                "2019-11-23 10:59:05",
                "2019-11-23 11:00:06",
            ],
            "icon": "marker",
            "iconstyle": {
                "iconUrl": 'https://deton.github.io/folium_tripslayer/car.svg',
                "iconSize": [22, 22],
                "iconAnchor": [11, 11]
            },
            "style": {
                "color": "purple",
            },
            "tooltip": "car",
            "popup": "car",
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [ -4.4214296, 36.73835 ],
                [ -4.422104, 36.737865 ],
                [ -4.4229302, 36.73773 ],
                [ -4.4235334, 36.735817 ],
                [ -4.4222927, 36.73413 ],
                [ -4.4218254, 36.732475 ],
                [ -4.4213734, 36.72983 ],
                [ -4.420156, 36.73 ],
                [ -4.419239, 36.730686 ],
                [ -4.417272, 36.732136 ],
            ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "car destination point",
            "times": [
                "2019-11-23 11:00:06",
            ],
            "icon": "circle",
            "iconstyle": {
                "color": "black",
                "radius": 4
            }
        },
        "geometry": {
            "type": "Point",
            "coordinates": [ -4.417272, 36.732136 ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "escooter",
            "icon": "marker",
            "iconstyle": {
                "iconUrl": 'https://deton.github.io/folium_tripslayer/walk.svg',
                "iconSize": [22, 22],
                "iconAnchor": [11, 11]
            },
            "style": {
                "color": "salmon",
            },
            "sliceStyles": [[5, 11, "styleEscooter"]],
            "styleEscooter": {
                "iconstyle": {
                    "iconUrl": 'https://deton.github.io/folium_tripslayer/escooter.svg',
                    "iconSize": [22, 22],
                    "iconAnchor": [11, 11]
                },
                "style": {
                    "color": "MediumAquamarine",
                },
            },
            "times": [
                "2019-11-23 10:51:06",
                "2019-11-23 10:52:05",
                "2019-11-23 10:53:05",
                "2019-11-23 10:54:04",
                "2019-11-23 10:55:05",
                "2019-11-23 10:56:05",
                "2019-11-23 10:57:05",
                "2019-11-23 10:58:05",
                "2019-11-23 10:59:05",
                "2019-11-23 11:00:06",
                "2019-11-23 11:01:06",
                "2019-11-23 11:02:06",
                "2019-11-23 11:03:05",
                "2019-11-23 11:04:04",
                "2019-11-23 11:05:06",
                "2019-11-23 11:06:05",
            ]
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [ -4.4155564, 36.732613 ],
                [ -4.4147606, 36.729523 ],
                [ -4.4143534, 36.728085 ],
                [ -4.414023, 36.727142 ],
                [ -4.4145956, 36.726017 ],
                [ -4.4163203, 36.722366 ],
                [ -4.4142747, 36.72012 ],
                [ -4.4162464, 36.71957 ],
                [ -4.418931, 36.71882 ],
                [ -4.421059, 36.718254 ],
                [ -4.421595, 36.718174 ],
                [ -4.424712, 36.717197 ],
                [ -4.4268923, 36.717003 ],
                [ -4.427205, 36.717583 ],
                [ -4.426953, 36.717876 ],
                [ -4.4264026, 36.715973 ],
            ]
        }
    }, {
        "type": "Feature",
        "properties": {
            "name": "walk",
            #"icon": "circle",
            "icon": "marker",
            "iconstyle": {
                "iconUrl": 'https://deton.github.io/folium_tripslayer/walk.svg',
                "iconSize": [22, 22],
                "iconAnchor": [11, 11]
            },
            "style": {
                "color": "salmon",
            },
            "times": [
                "2019-11-23 10:51:00",
                "2019-11-23 10:52:00",
                "2019-11-23 10:53:00",
                "2019-11-23 10:54:00",
                "2019-11-23 10:56:00",
                "2019-11-23 10:57:00",
                "2019-11-23 10:58:00",
                "2019-11-23 10:59:00",
                "2019-11-23 11:00:00",
            ]
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [ -4.4454684, 36.702717 ],
                [ -4.440271, 36.704346 ],
                [ -4.4393854, 36.70489 ],
                [ -4.437068, 36.706684 ],
                [ -4.4344425, 36.70879 ],
                [ -4.4314194, 36.71117 ],
                [ -4.4300385, 36.71217 ],
                [ -4.4270782, 36.714962 ],
                [ -4.4267263, 36.71531 ],
            ]
        }
    }]
}

TripsLayer(geojson, loop=False, period="PT1M", duration="PT4M", toggle_line=True, hide_line_on_init=True).add_to(m)

m.save('demo.html')
