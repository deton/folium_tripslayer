from branca.element import MacroElement
from jinja2 import Template

from folium.plugins import TimestampedGeoJson


class TripsLayer(TimestampedGeoJson):
    """
    Folium plugin to show moving icon along with TimestampedGeoJson LineString.
    """

    _template = Template(
        """
        {% macro script(this, kwargs) %}
            L.Control.TimeDimensionCustom = L.Control.TimeDimension.extend({
                _getDisplayDateFormat: function(date){
                    var newdate = new moment(date);
                    console.log(newdate)
                    return newdate.format("{{this.date_options}}");
                }
            });
            {{this._parent.get_name()}}.timeDimension = L.timeDimension(
                {
                    period: {{ this.period|tojson }},
                }
            );
            var timeDimensionControl = new L.Control.TimeDimensionCustom(
                {{ this.options|tojson }}
            );
            {{this._parent.get_name()}}.addControl(this.timeDimensionControl);

            var tripsLayer = L.timeDimension.layer.trips();
            tripsLayer.addTripsLayers({{this._parent.get_name()}}, {{this.data}}, {{this.duration}});
        {% endmacro %}
        """
    )  # noqa

    default_js = [
        (
            "iso8601",
            "https://cdn.jsdelivr.net/npm/iso8601-js-period@0.2.1/iso8601.min.js",
        ),
        (
            "leaflet.timedimension",
            "https://cdn.jsdelivr.net/npm/leaflet-timedimension@1.1.1/dist/leaflet.timedimension.min.js",
        ),
        # noqa
        (
            "moment",
            "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js",
        ),
        (
            "Leaflet.TimeDimension.Layer.GeoJsonWhole",
            "http://localhost:8000/leaflet.timedimension.layer.geojsonwhole.js",
        ),
        (
            "Leaflet.TimeDimension.Layer.Trips",
            "http://localhost:8000/leaflet.timedimension.layer.trips.js",
        )
    ]

    def __init__(
        self,
        data,
        transition_time=200,
        loop=True,
        auto_play=True,
        add_last_point=False,
        period="PT1M",
        min_speed=0.1,
        max_speed=10,
        loop_button=False,
        date_options="YYYY-MM-DD HH:mm:ss",
        time_slider_drag_update=False,
        duration="PT4M",
        speed_slider=True,
    ):
        super().__init__(
            data,
            transition_time,
            loop,
            auto_play,
            add_last_point,
            period,
            min_speed,
            max_speed,
            loop_button,
            date_options,
            time_slider_drag_update,
            duration,
            speed_slider,
        )
        self._name = "TripsLayer"
