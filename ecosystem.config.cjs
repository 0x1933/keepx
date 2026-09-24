/**
 * PM2 process file for Keepx Next.js app.
 * Listens on PORT (default 3002).
 */
module.exports = {
  apps: [
    {
      name: "keepx",
      cwd: "/var/www/rangeframe",
      script: "node_modules/.bin/next",
      args: "start -H 127.0.0.1 -p 3002",
      instances: 1,
      autorestart: true,
      max_restarts: 20,
      min_uptime: "5s",
      kill_timeout: 10000,
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
