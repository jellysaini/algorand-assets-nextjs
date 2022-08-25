/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ALGO_FAUCET_ACCOUNT_ADDRESS_: process.env.ALGO_FAUCET_ACCOUNT_ADDRESS,
    ALGO_FAUCET_PRIVATE_KEY_: process.env.ALGO_FAUCET_PRIVATE_KEY,
    ALGO_FAUCET_PASSPHRASE_: process.env.ALGO_FAUCET_PASSPHRASE,
    ALGO_TEST_ACCOUNT_PASSPHRASE_: process.env.ALGO_TEST_ACCOUNT_PASSPHRASE,
    ALGO_TEST_ACCOUNT_ADDRESS_: process.env.ALGO_TEST_ACCOUNT_ADDRESS,
    ALGO_TOKEN_: process.env.ALGO_TOKEN,
    ALGO_SERVER_: process.env.ALGO_SERVER,
    ALGO_INDEXER_TOKEN_: process.env.ALGO_INDEXER_TOKEN,
    ALGO_INDEXER_SERVER_: process.env.ALGO_INDEXER_SERVER,
  },
  async headers() {
    return [
      {
        source: '/algorand/asa',
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-API-Key, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/algorand/:path*',
        destination: 'http://r2.algorand.network/:path*',
      },
    ]
  },
}

module.exports = nextConfig
