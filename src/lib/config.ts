export const APP_URL =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.NEXT_PUBLIC_APP_URL}.com`
    : `http://localhost:3000`;