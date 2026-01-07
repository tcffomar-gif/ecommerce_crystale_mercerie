// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// module.exports = {
//   env: {
//     NEXT_PUBLIC_MY_URL: process.env.NEXT_PUBLIC_MY_URL,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'assets.aceternity.com',
//         port: '',
       
//       },
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//         port: '',
       
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//         port: '',
       
//       },
//       {
//         protocol: 'https',
//         hostname: 'firebasestorage.googleapis.com',
//         port: '',
       
//       },
//     ],
//   },
// }



const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'standalone',
  env: {
        NEXT_PUBLIC_MY_URL: process.env.NEXT_PUBLIC_MY_URL,
      },
      images: {
        // unoptimized: true, // Disables all image optimizations globally
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'assets.aceternity.com',
            port: '',
           
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
           
          },
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
           
          },
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
           
          },
        ],
      },
};
 
module.exports = withNextIntl(nextConfig);
