const strapi = require('@strapi/strapi');

const strapiInstance = strapi({
  // configuration is obtained as per the logic present in:
  // node_modules/@strapi/strapi/lib/commands/start.js
  appDir: process.cwd(),
  distDir: process.cwd()
});

async function closeGracefully(signal) {
  await strapiInstance.stop();
  process.kill(process.pid, signal);
}

strapiInstance.start();

process.once('SIGINT', closeGracefully);
process.once('SIGTERM', closeGracefully);
