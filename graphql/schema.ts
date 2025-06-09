import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Query {
    forecast(
      latitude: Float!
      longitude: Float!
      hourly: [HourlyVariable!]
      daily: [DailyVariable!]
      current_weather: Boolean
      temperature_unit: TemperatureUnit
      wind_speed_unit: WindSpeedUnit
      timeformat: TimeFormat
      timezone: String
      past_days: PastDays
    ): Forecast
    
    geocode(
      name: String!
      count: Int
      language: String
      countryCode: String
    ): GeocodingResponse
  }

  enum HourlyVariable {
    temperature_2m
    relative_humidity_2m
    dew_point_2m
    apparent_temperature
    pressure_msl
    cloud_cover
    cloud_cover_low
    cloud_cover_mid
    cloud_cover_high
    wind_speed_10m
    wind_speed_80m
    wind_speed_120m
    wind_speed_180m
    wind_direction_10m
    wind_direction_80m
    wind_direction_120m
    wind_direction_180m
    wind_gusts_10m
    shortwave_radiation
    direct_radiation
    direct_normal_irradiance
    diffuse_radiation
    vapour_pressure_deficit
    evapotranspiration
    precipitation
    weather_code
    snow_height
    freezing_level_height
    soil_temperature_0cm
    soil_temperature_6cm
    soil_temperature_18cm
    soil_temperature_54cm
    soil_moisture_0_1cm
    soil_moisture_1_3cm
    soil_moisture_3_9cm
    soil_moisture_9_27cm
    soil_moisture_27_81cm
  }

  enum DailyVariable {
    temperature_2m_max
    temperature_2m_min
    apparent_temperature_max
    apparent_temperature_min
    precipitation_sum
    precipitation_hours
    weather_code
    sunrise
    sunset
    wind_speed_10m_max
    wind_gusts_10m_max
    wind_direction_10m_dominant
    shortwave_radiation_sum
    uv_index_max
    uv_index_clear_sky_max
    et0_fao_evapotranspiration
  }

  enum TemperatureUnit {
    celsius
    fahrenheit
  }

  enum WindSpeedUnit {
    kmh
    ms
    mph
    kn
  }

  enum TimeFormat {
    iso8601
    unixtime
  }

  enum PastDays {
    ONE
    TWO
  }

  type Forecast {
    latitude: Float
    longitude: Float
    elevation: Float
    generationtime_ms: Float
    utc_offset_seconds: Int
    hourly: HourlyResponse
    hourly_units: Units
    daily: DailyResponse
    daily_units: Units
    current_weather: CurrentWeather
    activityRankings: [ActivityRanking]
  }

  type Units {
    time: String
    temperature_2m: String
    relative_humidity_2m: String
    dew_point_2m: String
    apparent_temperature: String
    pressure_msl: String
    cloud_cover: String
    cloud_cover_low: String
    cloud_cover_mid: String
    cloud_cover_high: String
    wind_speed_10m: String
    wind_direction_10m: String
    wind_gusts_10m: String
    precipitation: String
    weather_code: String
    temperature_2m_max: String
    temperature_2m_min: String
    apparent_temperature_max: String
    apparent_temperature_min: String
    precipitation_sum: String
    precipitation_hours: String
    sunrise: String
    sunset: String
    wind_speed_10m_max: String
    wind_gusts_10m_max: String
    wind_direction_10m_dominant: String
    shortwave_radiation_sum: String
    uv_index_max: String
    uv_index_clear_sky_max: String
    et0_fao_evapotranspiration: String
  }

  type HourlyResponse {
    time: [String!]
    temperature_2m: [Float]
    relative_humidity_2m: [Float]
    dew_point_2m: [Float]
    apparent_temperature: [Float]
    pressure_msl: [Float]
    cloud_cover: [Float]
    cloud_cover_low: [Float]
    cloud_cover_mid: [Float]
    cloud_cover_high: [Float]
    wind_speed_10m: [Float]
    wind_speed_80m: [Float]
    wind_speed_120m: [Float]
    wind_speed_180m: [Float]
    wind_direction_10m: [Float]
    wind_direction_80m: [Float]
    wind_direction_120m: [Float]
    wind_direction_180m: [Float]
    wind_gusts_10m: [Float]
    shortwave_radiation: [Float]
    direct_radiation: [Float]
    direct_normal_irradiance: [Float]
    diffuse_radiation: [Float]
    vapour_pressure_deficit: [Float]
    evapotranspiration: [Float]
    precipitation: [Float]
    weather_code: [Int]
    snow_height: [Float]
    freezing_level_height: [Float]
    soil_temperature_0cm: [Float]
    soil_temperature_6cm: [Float]
    soil_temperature_18cm: [Float]
    soil_temperature_54cm: [Float]
    soil_moisture_0_1cm: [Float]
    soil_moisture_1_3cm: [Float]
    soil_moisture_3_9cm: [Float]
    soil_moisture_9_27cm: [Float]
    soil_moisture_27_81cm: [Float]
  }

  type DailyResponse {
    time: [String!]
    temperature_2m_max: [Float]
    temperature_2m_min: [Float]
    apparent_temperature_max: [Float]
    apparent_temperature_min: [Float]
    precipitation_sum: [Float]
    precipitation_hours: [Float]
    weather_code: [Int]
    sunrise: [String]
    sunset: [String]
    wind_speed_10m_max: [Float]
    wind_gusts_10m_max: [Float]
    wind_direction_10m_dominant: [Float]
    shortwave_radiation_sum: [Float]
    uv_index_max: [Float]
    uv_index_clear_sky_max: [Float]
    et0_fao_evapotranspiration: [Float]
  }

  type CurrentWeather {
    time: String!
    temperature: Float
    wind_speed: Float
    wind_direction: Float
    weather_code: Int
  }
  
  type GeocodingResponse {
    results: [Location]
  }
  
  type ActivityRanking {
    activity: String!
    averageScore: Float!
    dailyScores: [Float!]!
    reasoning: String!
  }

  type Location {
    id: Int
    name: String
    latitude: Float
    longitude: Float
    elevation: Float
    feature_code: String
    country_code: String
    country: String
    country_id: Int
    population: Int
    postcodes: [String]
    timezone: String
    admin1: String
    admin2: String
    admin3: String
    admin4: String
    admin1_id: Int
    admin2_id: Int
    admin3_id: Int
    admin4_id: Int
    forecast(
      hourly: [HourlyVariable!]
      daily: [DailyVariable!]
      current_weather: Boolean
      temperature_unit: TemperatureUnit
      wind_speed_unit: WindSpeedUnit
      timeformat: TimeFormat
      past_days: PastDays
    ): Forecast
    activityRankings: [ActivityRanking!]
  }
`;
