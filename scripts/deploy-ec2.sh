#!/bin/bash

# Variables
APP_NAME="cp-platform"
EC2_INSTANCE="your-ec2-instance-ip"
USER="ec2-user"  # Change this if your EC2 instance uses a different user
KEY_PATH="path/to/your/key.pem"  # Path to your SSH key
REMOTE_DIR="/var/www/$APP_NAME"

# Build the application
echo "Building the application..."
cd src/frontend
npm install
npm run build

# Copy files to EC2
echo "Deploying to EC2 instance..."
scp -i $KEY_PATH -r build/* $USER@$EC2_INSTANCE:$REMOTE_DIR

# Restart the server (assuming you have a service manager like systemd)
echo "Restarting the application on EC2..."
ssh -i $KEY_PATH $USER@$EC2_INSTANCE "cd $REMOTE_DIR && pm2 restart $APP_NAME"

echo "Deployment completed successfully!"