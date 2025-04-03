@echo off
rem Grant execute permissions to the vite binary
echo Setting executable permissions for Vite...
cd node_modules\.bin
echo "Setting permissions for vite..."
icacls vite /grant Everyone:F
cd ../../..
echo "Permissions set successfully!"
