/*
 * L.TimeDimension.Layer.GeoJsonWhole:
 */

// based on https://www.socib.es/users/bfrontera/timewms/examples/example19.html
L.TimeDimension.Layer.GeoJsonWhole = L.TimeDimension.Layer.GeoJson.extend({
    // Do not modify features. Just return the feature if it intersects
    // the time interval
    _getFeatureBetweenDates: function(feature, minTime, maxTime) {
        var featureStringTimes = this._getFeatureTimes(feature);
        if (featureStringTimes.length == 0) {
            return feature;
        }
        var featureTimes = [];
        for (var i = 0, l = featureStringTimes.length; i < l; i++) {
            var time = featureStringTimes[i]
            if (typeof time == 'string' || time instanceof String) {
                time = Date.parse(time.trim());
            }
            featureTimes.push(time);
        }

        if (featureTimes[0] > maxTime || featureTimes[l - 1] < minTime) {
            return null;
        }
        return feature;
    },
});

L.timeDimension.layer.geoJsonWhole = function(layer, options) {
    return new L.TimeDimension.Layer.GeoJsonWhole(layer, options);
};
