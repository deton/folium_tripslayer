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
                    //console.log(newdate)
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
            tripsLayer.addTripsLayers(
                {{ this._parent.get_name() }},
                {{ this.data }},
                {{ this.duration }},
                {{ this.period|tojson }},
                {{ this.toggle_line|tojson }},
                {{ this.hide_line_on_init|tojson }}
            );
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
            "https://deton.github.io/Leaflet.TimeDimension/dist/leaflet.timedimension.min.js"
            # XXX: some fixes not released yet
            #"https://cdn.jsdelivr.net/npm/leaflet-timedimension@1.1.1/dist/leaflet.timedimension.min.js",
        ),
        # noqa
        (
            "moment",
            "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js",
        ),
        (
            "Leaflet.TimeDimension.Layer.GeoJsonWhole",
            "https://deton.github.io/folium_tripslayer/leaflet.timedimension.layer.geojsonwhole.js",
        ),
        (
            "Leaflet.TimeDimension.Layer.Trips",
            "https://deton.github.io/folium_tripslayer/leaflet.timedimension.layer.trips.js",
        )
    ]

    def __init__(
        self,
        data,
        transition_time=400,
        loop=False,
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
        toggle_line=False,
        hide_line_on_init=False,
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
        self.toggle_line = toggle_line
        self.hide_line_on_init = hide_line_on_init
