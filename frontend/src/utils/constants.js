const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const prodUrl = 'https://lostandfoundmcc-bca1u0v0p-lee7devil-maniacs-projects.vercel.app'; // Verified from screenshot

const apiTarget = import.meta.env.VITE_API_URL ?
    (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`) :
    (isLocal ? 'http://localhost:5000/api' : `${prodUrl}/api`);

// Extract the base domain for images and append /uploads/
const imageBase = import.meta.env.VITE_IMAGE_BASE_URL ||
    (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : (isLocal ? 'http://localhost:5000' : prodUrl));

export const API_BASE_URL = apiTarget;
export const IMAGE_BASE_URL = `${imageBase}/uploads/`.replace(/([^:])\/\//g, '$1/');
