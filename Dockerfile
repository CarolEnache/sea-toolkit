# Get the latest node from balena
FROM balenalib/raspberry-pi2-ubuntu-node:latest-latest
# Set up working directory
WORKDIR /app
# Set up environment
ENV CI="true"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Expose ports
EXPOSE 3000

# Switch to whichever node we want
RUN npx -y n install 20

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Should we do checkout instead of copy?
COPY package.json ./
# Install command
RUN pnpm install

COPY ./.next ./.next

CMD npm start
