#!/bin/bash

# This script sets up the database for the competitive programming platform.
# It runs the SQL schema and applies any migrations.

# Exit immediately if a command exits with a non-zero status
set -e

# Database configuration
DB_NAME="cp_platform"
DB_USER="your_db_user"
DB_PASSWORD="your_db_password"
DB_HOST="localhost"

# Function to run SQL commands
run_sql() {
    PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d $DB_NAME -f "$1"
}

# Create the database if it doesn't exist
echo "Creating database if it doesn't exist..."
psql -U $DB_USER -h $DB_HOST -c "CREATE DATABASE $DB_NAME;"

# Run the schema
echo "Setting up the database schema..."
run_sql "../db/schema.sql"

# Run migrations
echo "Applying migrations..."
for migration in ../db/migrations/*.sql; do
    run_sql "$migration"
done

echo "Database setup complete."