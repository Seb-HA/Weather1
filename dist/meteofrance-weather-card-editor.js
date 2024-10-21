//V0.2
const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

if (!customElements.get("ha-switch") && customElements.get("paper-toggle-button")) {
  customElements.define("ha-switch", customElements.get("paper-toggle-button"));
}

if (!customElements.get("ha-entity-picker")) {
  customElements.get("hui-entities-card").getConfigElement();
}

const LitElement = customElements.get("hui-masonry-view")
  ? Object.getPrototypeOf(customElements.get("hui-masonry-view"))
  : Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const HELPERS = window.loadCardHelpers();

const DefaultSensors = new Map([
  ["detailEntity", "_rain_chance"],
  ["cloudCoverEntity", "_cloud_cover"],
  ["rainChanceEntity", "_rain_chance"],
  ["freezeChanceEntity", "_freeze_chance"],
  ["snowChanceEntity", "_snow_chance"],
  ["uvEntity", "_uv"],
  ["rainForecastEntity", "_next_rain"],
]);

export class MeteofranceWeatherCardEditor extends LitElement {
  constructor() {
    super();
    // Ensure _config always starts as an object with a default card type
    this._config = { type: "custom:meteofrance-weather-card" };
  }

  setConfig(config) {
    // Merge provided config with defaults to avoid undefined issues
    this._config = {
      type: "custom:meteofrance-weather-card",
      name: config.name || "", // Default empty name
      entity: config.entity || "",
      icons: config.icons || "",
      current: config.current !== false, // Ensure it's boolean
      details: config.details !== false,
      daily_forecast: config.daily_forecast !== false,
      hourly_forecast: config.hourly_forecast !== false,
      number_of_hourly_forecasts: config.number_of_hourly_forecasts || 5,
      number_of_daily_forecasts: config.number_of_daily_forecasts || 5,
      one_hour_forecast: config.one_hour_forecast !== false,
      alert_forecast: config.alert_forecast !== false,
      animated_icons: config.animated_icons !== false,
      wind_forecast_icons: config.wind_forecast_icons !== false,
      humidity_forecast: config.humidity_forecast !== false,
      alertEntity: config.alertEntity || "",
      cloudCoverEntity: config.cloudCoverEntity || "",
      freezeChanceEntity: config.freezeChanceEntity || "",
      rainChanceEntity: config.rainChanceEntity || "",
      rainForecastEntity: config.rainForecastEntity || "",
      snowChanceEntity: config.snowChanceEntity || "",
      uvEntity: config.uvEntity || "",
      detailEntity: config.detailEntity || "",
    };

    // Automatically set default values if only entity and type are provided
    if (Object.keys(config).length === 2 && config.entity !== undefined) {
      this._weatherEntityChanged(config.entity.split(".")[1]);
      fireEvent(this, "config-changed", { config: this._config });
    }
  }

  static get properties() {
    return { hass: {}, _config: {} };
  }

  // Ensure the card `type` is always part of the config to prevent "No card type configured"
  get _type() {
    return this._config.type || "custom:meteofrance-weather-card";
  }
  

  get _entity() {
    return this._config.entity || "";
  }

  get _name() {
    return this._config.name || "";
  }

  get _icons() {
    return this._config.icons || "";
  }

  get _current() {
    return this._config.current ?? true;
  }

  get _details() {
    return this._config.details ?? true;
  }

  get _daily_forecast() {
    return this._config.daily_forecast ?? true;
  }

  get _number_of_daily_forecasts() {
    return this._config.number_of_daily_forecasts || 5;
  }

  get _hourly_forecast() {
    return this._config.hourly_forecast ?? true;
  }

  get _number_of_hourly_forecasts() {
    return this._config.number_of_hourly_forecasts || 5;
  }

  get _one_hour_forecast() {
    return this._config.one_hour_forecast ?? true;
  }

  get _alert_forecast() {
    return this._config.alert_forecast ?? true;
  }

  get _animated_icons() {
    return this._config.animated_icons ?? true;
  }

  get _wind_forecast_icons() {
    return this._config.wind_forecast_icons ?? true;
  }

  get _humidity_forecast() {
    return this._config.humidity_forecast ?? true;
  }

  get _alertEntity() {
    return this._config.alertEntity || "";
  }

  get _cloudCoverEntity() {
    return this._config.cloudCoverEntity || "";
  }

  get _freezeChanceEntity() {
    return this._config.freezeChanceEntity || "";
  }

  get _rainChanceEntity() {
    return this._config.rainChanceEntity || "";
  }

  get _rainForecastEntity() {
    return this._config.rainForecastEntity || "";
  }

  get _snowChanceEntity() {
    return this._config.snowChanceEntity || "";
  }

  get _uvEntity() {
    return this._config.uvEntity || "";
  }

  get _detailEntity() {
    return this._config.detailEntity || "";
  }


  firstUpdated() {
    HELPERS.then((help) => {
      if (help.importMoreInfoControl) {
        help.importMoreInfoControl("fan");
      }
    });
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div>
          <!-- Primary weather entity -->
          ${this.renderWeatherPicker("Entité", this._entity, "entity")}
          ${this.renderTextField("Nom", this._name, "name")}
          ${this.renderSensorPicker("Détail", this._detailEntity, "detailEntity")}
          <!-- Switches -->
          <ul class="switches">
            ${this.renderSwitchOption("Météo actuelle", this._current, "current")}
            ${this.renderSwitchOption("Détails", this._details, "details")}
            ${this.renderSwitchOption("Alertes", this._alert_forecast, "alert_forecast")}
            ${this.renderSwitchOption("Pluie dans l'heure", this._one_hour_forecast, "one_hour_forecast")}
            ${this.renderSwitchOption("Prévisions par heure", this._hourly_forecast, "hourly_forecast")}
            ${this.renderSwitchOption("Prévisions par jour", this._daily_forecast, "daily_forecast")}
            ${this.renderSwitchOption("Humidité", this._humidity_forecast, "humidity_forecast")}
            ${this.renderSwitchOption("Girouette", this._wind_forecast_icons, "wind_forecast_icons")}
            ${this.renderSwitchOption("Icones animées", this._animated_icons, "animated_icons")}
          </ul>
          <!-- -->
          ${this.renderNumberField("Nombres d'heures", this._number_of_hourly_forecasts, "number_of_hourly_forecasts")}
          ${this.renderNumberField("Nombres de jours", this._number_of_daily_forecasts, "number_of_daily_forecasts")}
          <!-- Meteo France weather entities -->
          ${this.renderSensorPicker("Risque de pluie", this._rainChanceEntity, "rainChanceEntity")}
          ${this.renderSensorPicker("UV", this._uvEntity, "uvEntity")}
          ${this.renderSensorPicker("Couverture nuageuse", this._cloudCoverEntity, "cloudCoverEntity")}
          ${this.renderSensorPicker("Risque de gel", this._freezeChanceEntity, "freezeChanceEntity")}
          ${this.renderSensorPicker("Risque de neige", this._snowChanceEntity, "snowChanceEntity")}
          ${this.renderSensorPicker("Vigilance Météo", this._alertEntity, "alertEntity")}
          ${this.renderSensorPicker("Pluie dans l'heure", this._rainForecastEntity, "rainForecastEntity")}
          ${this.renderTextField("Répertoire des icones", this._icons, "icons")}
        </div>
      </div>
    `;
  }

  renderTextField(label, state, configAttr) {
    return this.renderField(label, state, configAttr, "text");
  }

  renderNumberField(label, state, configAttr) {
    return this.renderField(label, state, configAttr, "number");
  }

  renderField(label, state, configAttr, type) {
    return html`
      <ha-textfield
        label="${label}"
        .value="${state}"
        type="${type}"
        .configValue=${configAttr}
        @input=${this._valueChanged}
      ></ha-textfield>
    `;
  }

  renderWeatherPicker(label, entity, configAttr) {
    return this.renderPicker(label, entity, configAttr, "weather");
  }

  renderSensorPicker(label, entity, configAttr) {
    return this.renderPicker(label, entity, configAttr, "sensor");
  }

  renderPicker(label, entity, configAttr, domain) {
    return html`
      <ha-entity-picker
        label="${label}"
        .hass="${this.hass}"
        .value="${entity}"
        .configValue="${configAttr}"
        .includeDomains="${domain}"
        @change="${this._valueChanged}"
        allow-custom-entity
      ></ha-entity-picker>
    `;
  }

  renderSwitchOption(label, state, configAttr) {
    return html`
      <li class="switch">
        <ha-switch
          .checked=${state}
          .configValue="${configAttr}"
          @change="${this._valueChanged}"
        ></ha-switch
        ><span>${label}</span>
      </li>
    `;
  }

  _weatherEntityChanged(weatherEntityName) {
    const weatherEntityNameFull = "weather." + weatherEntityName;
    const state = this.hass.states[weatherEntityNameFull];
    if (state !== undefined) {
      const friendly_name = state.attributes.friendly_name;
      this._config = {
        ...this._config,
        name: friendly_name || "",
      };

      DefaultSensors.forEach((sensorSuffix, configAttribute) => {
        const entity = "sensor." + weatherEntityName + sensorSuffix;
        if (this.hass.states[entity] !== undefined) {
          this._config = {
            ...this._config,
            [configAttribute]: entity,
          };
        }
      });
    }
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === "") {
        delete this._config[target.configValue];
      } else {
        if (target.configValue === "entity")
          this._weatherEntityChanged(target.value.split(".")[1]);
        this._config = {
          ...this._config,
          [target.configValue]:
            target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, "config-changed", { config: this._config });
  }

  static get styles() {
    return css`
      .switches {
        margin: 8px 0;
        display: flex;
        flex-flow: row wrap;
        list-style: none;
        padding: 0;
      }
      .switch {
        display: flex;
        align-items: center;
        width: 50%;
        height: 40px;
      }
      .switches span {
        padding: 0 16px;
      }
    `;
  }
}

customElements.define("meteofrance-weather-card-editor", MeteofranceWeatherCardEditor);
