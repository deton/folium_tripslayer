/*
 * L.TimeDimension.Layer.Trips:
 */

// TODO: extends L.TimeDimension.Layer
L.timeDimension.layer.trips = function() {
    return { addTripsLayers };

    function addTripsLayers(map, geojson, duration, period, toggleLine) {
        const iconjson = {
            type: 'FeatureCollection',
            features: []
        };
        const linejson = {
            type: 'FeatureCollection',
            features: []
        };
        geojson.features.forEach(f => {
            const shared = { // shared object from linejson and iconjson
                stroke: toggleLine ? false : true,
                _layers: [],
                _styles: [],
            };
            if (f.properties.sliceStyles === undefined) {
                f.properties._shared = shared;
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

            // linejson
            let idx = 0;
            f.properties.sliceStyles.forEach(ss => {
                if (ss[0] > idx) {
                    slicePush(idx, ss[0], {}, shared);
                    slicePush(ss[0] - 1, ss[1], f.properties[ss[2]], shared);
                } else {
                    slicePush(ss[0], ss[1], f.properties[ss[2]], shared);
                }
                idx = ss[1] - 1;
            });
            slicePush(idx, f.geometry.coordinates.length, {}, shared);

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
                    _shared: shared, // stroke of peer line
                },
                geometry: f.geometry,
            });
            //addIconPoints(iconjson, f, _timeStyles);

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

            function slicePush(startIdx, endIdx, overrideStyle, shared) {
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
                        _shared: shared,
                    },
                    geometry: {
                        type: f.geometry.type,
                        coordinates: coords,
                    },
                });
            }
        });

        const lineLayer = L.geoJson(linejson, {
            pointToLayer,
            style: function (feature) {
                if (!feature.properties._shared || feature.properties._shared.stroke) {
                    return {stroke: true, ...feature.properties.style};
                }
                return {stroke: false};
            },
            onEachFeature: (feature, layer) => {
                bindPopupTooltip(feature, layer);
                feature.properties._shared._layers.push(layer); // TODO:remove
                feature.properties._shared._styles.push(feature.properties.style);
                feature.properties._shared._toggleFunc = () => {
                    console.log('toggleFunc', feature.properties._shared._layers.length);
                    feature.properties._shared.stroke = !feature.properties._shared.stroke;
                    if (feature.properties._shared.stroke) { // show
                        feature.properties._shared._layers.forEach((x, idx) => {
                            const s = feature.properties._shared._styles[idx];
                            x.setStyle({stroke: true, ...s});
                        });
                    } else { // hide
                        feature.properties._shared._layers.forEach(x => {
                            x.setStyle({stroke: false});
                        });
                    }
                };
            },
        });
        // lineD layer to show the whole track
        const lineDLayer = L.timeDimension.layer.geoJsonWhole(lineLayer, {
            updateTimeDimension: true,
            duration: duration,
            updateTimeDimensionMode: 'replace',
        });
        lineDLayer.addTo(map);

        const iconLayer = L.geoJson(iconjson, {
            pointToLayer,
            style: {
                stroke: false, // XXX: Show only point added by addlastPoint
            },
            onEachFeature: (feature, layer) => {
                bindPopupTooltip(feature, layer);
                if (toggleLine) {
                    layer.on('click', (ev) => {
                        if (feature.properties._shared) {
                            feature.properties._shared._toggleFunc();
                        }
                    });
                }
            },
        });
        // iconD layer to show the movement of the icon 
        const iconDLayer = L.timeDimension.layer.geoJson(iconLayer, {
            updateTimeDimension: true,
            //duration: period,
            duration: duration,
            addlastPoint: true,
            updateTimeDimensionMode: 'replace',
        });
        iconDLayer.addTo(map);

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
