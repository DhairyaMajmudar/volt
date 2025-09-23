-- Database initialization script for VoltDB
-- This script will be executed when the PostgreSQL container starts for the first time

-- Set timezone
SET timezone = 'UTC';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE voltdb TO voltuser;