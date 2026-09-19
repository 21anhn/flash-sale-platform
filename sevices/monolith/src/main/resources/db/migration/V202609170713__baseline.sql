-- Baseline: proves Flyway chain works. Real tables come with RESERVATION-001.
CREATE TABLE IF NOT EXISTS schema_baseline (
  id BIGSERIAL PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);