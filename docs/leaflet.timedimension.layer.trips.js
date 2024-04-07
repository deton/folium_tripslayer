/*
 * L.TimeDimension.Layer.Trips:
 */

// TODO: extends L.TimeDimension.Layer
L.timeDimension.layer.trips = function() {
    return { addTripsLayers };

    function addTripsLayers(map, geojson, duration, period) {
        const iconjson = {
            type: 'FeatureCollection',
            features: []
        };
        const linejson = {
            type: 'FeatureCollection',
            features: []
        };
        geojson.features.forEach(f => {
            if (f.properties.sliceStyles === undefined) {
                //addIconPoints(iconjson, f);
                iconjson.features.push(f);
                linejson.features.push(f);
                return;
            }
            // convert string times to number [ms].
            // TODO: support 'coordTimes', etc.
            // cf. L.TimeDimension.Layer.GeoJson._getFeatureTimes()
            f.properties.times = f.properties.times.map(time => {
                if (typeof time == 'string' || time instanceof String) {
                    return Date.parse(time.trim());
                }
                return time;
            });
            // slice features array if properties has
            // "sliceStyles": [[2, 4, 'styleBus']],
            // "styleBus": {
            //     "style": {
            //         "color": "MediumAquamarine"
            //     },
            //     "iconstyle": {
            //         "iconUrl": "bus.png",
            //         "iconSize": [22, 22],
            //         "iconAnchor": [11, 11]
            //     }
            // }
            // _timeStyles: convert index to time for iconjson.
            const _timeStyles = f.properties.sliceStyles.map(ss => {
                let endIdx = ss[1];
                while (endIdx >= f.properties.times.length) {
                    endIdx -= 1;
                }
                return [
                    f.properties.times[ss[0]],
                    f.properties.times[endIdx],
                    ss[2],
                ];
            });
            iconjson.features.push({
                type: 'Feature',
                properties: {
                    ...f.properties,
                    _timeStyles,
                },
                geometry: f.geometry,
            });
            //addIconPoints(iconjson, f, _timeStyles);

            // linejson
            let idx = 0;
            f.properties.sliceStyles.forEach(ss => {
                if (ss[0] > idx) {
                    slicePush(idx, ss[0], {});
                    slicePush(ss[0] - 1, ss[1], f.properties[ss[2]]);
                } else {
                    slicePush(ss[0], ss[1], f.properties[ss[2]]);
                }
                idx = ss[1] - 1;
            });
            slicePush(idx, f.geometry.coordinates.length, {});

            /* XXX: To show only one point on the path without flicker,
             * needs to extend L.TimeDimension.Layer.GeoJson.
            function addIconPoints(iconjson, f, _timeStyles) {
                if (f.geometry.type != 'LineString') {
                    return; // XXX: only supports LineString
                }
                if (f.geometry.coordinates.length === 0) {
                    return;
                }
                let props = f.properties;
                if (_timeStyles) {
                    props = {
                        ...f.properties,
                        _timeStyles,
                    };
                }
                const points = f.geometry.coordinates.map((coord, idx) => ({
                    type: 'Feature',
                    properties: {
                        ...props,
                        times: [props.times[idx]],
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: coord,
                    }
                }));
                iconjson.features = iconjson.features.concat(points);
            }
            */

            function slicePush(startIdx, endIdx, overrideStyle) {
                if (startIdx >= endIdx) {
                    return;
                }
                const coords = f.geometry.coordinates.slice(startIdx, endIdx);
                // TODO: support 'coordTimes', etc.
                const times = f.properties.times.slice(startIdx, endIdx);
                // show whole LineString
                times[0] = f.properties.times[0];
                times[times.length - 1] = f.properties.times[f.properties.times.length - 1];
                linejson.features.push({
                    type: 'Feature',
                    properties: {
                        ...f.properties,
                        ...overrideStyle,
                        times,
                    },
                    geometry: {
                        type: f.geometry.type,
                        coordinates: coords,
                    }
                });
            }
        });

        var iconLayer = L.geoJson(iconjson, {
            pointToLayer,
            style: {
                opacity: 0, // XXX: Show only point added by addlastPoint
            },
            onEachFeature: bindPopupTooltip,
        });
        var lineLayer = L.geoJson(linejson, {
            pointToLayer,
            style: function (feature) {
                return feature.properties.style;
            },
            onEachFeature: bindPopupTooltip,
        });
        // Show both layers: the lineD layer to show the whole track
        // and the iconD layer to show the movement of the icon 
        var iconDLayer = L.timeDimension.layer.geoJson(iconLayer, {
            updateTimeDimension: true,
            //duration: period,
            duration: duration,
            addlastPoint: true,
            updateTimeDimensionMode: 'replace',
        });
        iconDLayer.addTo(map);

        var lineDLayer = L.timeDimension.layer.geoJsonWhole(lineLayer, {
            updateTimeDimension: true,
            duration: duration,
            updateTimeDimensionMode: 'replace',
        });
        lineDLayer.addTo(map);

        function pointToLayer(feature, latLng) {
            let iconstyle = feature.properties.iconstyle;
            if (iconstyle && feature.properties._timeStyles) {
                //console.log(feature.properties._timeStyles);
                const cur = map.timeDimension.getCurrentTime();
                feature.properties._timeStyles.some(ts => {
                    if (cur >= ts[0] && cur < ts[1]) {
                        iconstyle = feature.properties[ts[2]].iconstyle;
                        return true;
                    }
                });
            }
            if (feature.properties.icon == 'marker') {
                if (iconstyle) {
                    return new L.Marker(latLng, {
                        icon: L.icon(iconstyle)
                    });
                }
                return new L.Marker(latLng);
            }
            if (feature.properties.icon == 'circle') {
                if (iconstyle) {
                    return new L.circleMarker(latLng, iconstyle);
                }
                return new L.circleMarker(latLng);
            }
            return new L.Marker(latLng);
        }

        function bindPopupTooltip(feature, layer) {
            if (feature.properties.popup) {
                layer.bindPopup(feature.properties.popup);
            }
            if (feature.properties.tooltip) {
                layer.bindTooltip(feature.properties.tooltip);
            }
        }
    }
};
