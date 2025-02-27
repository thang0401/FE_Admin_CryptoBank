/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  swcMinify: false, // Tắt SWC minification
  experimental: {
    forceSwcTransforms: false, // Tắt SWC transforms
    swcMinify: false, // Đảm bảo SWC minify tắt hoàn toàn
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    return config
  }
}
