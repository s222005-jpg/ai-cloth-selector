CREATE TABLE clothing_items (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  color TEXT,
  material TEXT,
  warmth_level INTEGER NOT NULL DEFAULT 1, -- 1-5 scale
  water_resistance BOOLEAN NOT NULL DEFAULT FALSE,
  wind_resistance BOOLEAN NOT NULL DEFAULT FALSE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE recommendations (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  clothing_item_id BIGINT NOT NULL REFERENCES clothing_items(id) ON DELETE CASCADE,
  weather_temp DOUBLE PRECISION NOT NULL,
  weather_condition TEXT NOT NULL,
  weather_humidity DOUBLE PRECISION NOT NULL,
  weather_wind_speed DOUBLE PRECISION NOT NULL,
  suitability_score INTEGER NOT NULL, -- 1-100 scale
  reasoning TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clothing_items_user_id ON clothing_items(user_id);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_score ON recommendations(suitability_score DESC);
