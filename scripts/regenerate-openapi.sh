#!/bin/bash

# Regenerate OpenAPI Client Script
# This script regenerates the TypeScript client from your FastAPI OpenAPI schema

echo "🔄 Regenerating OpenAPI TypeScript client..."

# Check if FastAPI server is running
echo "📡 Checking if FastAPI server is running..."
if ! curl -s http://127.0.0.1:8060/openapi.json > /dev/null; then
    echo "❌ FastAPI server is not running on http://127.0.0.1:8060"
    echo "Please start your FastAPI server first:"
    echo "  cd your-backend-directory"
    echo "  uvicorn main:app --host 127.0.0.1 --port 8060 --reload"
    exit 1
fi

echo "✅ FastAPI server is running"

# Backup existing generated files
echo "💾 Backing up existing generated files..."
if [ -d "src/api/generated" ]; then
    cp -r src/api/generated src/api/generated.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created"
fi

# Install openapi-typescript-codegen if not already installed
echo "📦 Installing openapi-typescript-codegen..."
npm install -g openapi-typescript-codegen

# Generate new client
echo "🔧 Generating new TypeScript client..."
npx openapi-typescript-codegen \
    -i http://127.0.0.1:8060/openapi.json \
    -o src/api/generated \
    --client axios \
    --useOptions \
    --useUnionTypes

if [ $? -eq 0 ]; then
    echo "✅ OpenAPI client generated successfully!"
    echo ""
    echo "📋 New services available:"
    echo "  - MenuAnalyticsService (for menu analytics endpoints)"
    echo "  - Any other new services you added to your FastAPI backend"
    echo ""
    echo "🔧 Next steps:"
    echo "  1. Update your hooks to use the new generated services"
    echo "  2. Replace direct API calls with generated service methods"
    echo "  3. Test the new endpoints"
    echo ""
    echo "📁 Generated files are in: src/api/generated/"
else
    echo "❌ Failed to generate OpenAPI client"
    echo "Check the error messages above and try again"
    exit 1
fi
