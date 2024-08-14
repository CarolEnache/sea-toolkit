# Use a base image with Node.js 20 for Raspberry Pi 2
FROM balenalib/raspberry-pi-debian-python:latest

# Set up working directory
WORKDIR /app

# Set up environment
ENV CI=true
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Expose ports if your application needs it
EXPOSE 3000

# Install Node.js and corepack (for pnpm)
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    corepack enable && corepack prepare pnpm@latest --activate && \
    rm -rf /var/lib/apt/lists/*

RUN pip install duckdb --upgrade
# Copy package.json and package-lock.json first (for caching)
COPY package.json ./

# Install Node.js dependencies using pnpm (caches if unchanged)
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application (if needed)
RUN npm run build

# Command to run your application
CMD pnpm start
