/*
 * L.TimeDimension.Layer.Trips:
 */

// TODO: extends L.TimeDimension.Layer
L.timeDimension.layer.trips = function() {
    return {
        addTripsLayers: function(map, data, duration) {
            var iconLayer = L.geoJson(data, {
                pointToLayer: function (feature, latLng) {
                    if (feature.properties.icon == 'marker') {
                        if(feature.properties.iconstyle){
                            return new L.Marker(latLng, {
                                icon: L.icon(feature.properties.iconstyle)
                            });
                        }
                        return new L.Marker(latLng);
                    }
                    if (feature.properties.icon == 'circle') {
                        if (feature.properties.iconstyle) {
                            return new L.circleMarker(latLng, feature.properties.iconstyle);
                        }
                        return new L.circleMarker(latLng);
                    }
                    return new L.Marker(latLng);
                },
                style: {
                    opacity: 0, // TODO: Use Point only
                },
                onEachFeature: function(feature, layer) {
                    if (feature.properties.popup) {
                        layer.bindPopup(feature.properties.popup);
                    }
                    if (feature.properties.tooltip) {
                        layer.bindTooltip(feature.properties.tooltip);
                    }
                }
            });
            var lineLayer = L.geoJson(data, {
                style: function (feature) {
                    return feature.properties.style;
                },
                onEachFeature: function(feature, layer) {
                    if (feature.properties.popup) {
                        layer.bindPopup(feature.properties.popup);
                    }
                    if (feature.properties.tooltip) {
                        layer.bindTooltip(feature.properties.tooltip);
                    }
                }
            });
            // Show both layers: the lineD layer to show the whole track
            // and the iconD layer to show the movement of the icon 
            var iconDLayer = L.timeDimension.layer.geoJson(iconLayer, {
                updateTimeDimension: true,
                duration: duration,
                updateTimeDimensionMode: 'replace',
                addlastPoint: true
            });
            iconDLayer.addTo(map);

            var lineDLayer = L.timeDimension.layer.geoJsonWhole(lineLayer, {
                updateTimeDimension: true,
                duration: duration,
                updateTimeDimensionMode: 'replace',
            });
            lineDLayer.addTo(map);
        }
    };
};
