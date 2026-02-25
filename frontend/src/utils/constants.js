const apiTarget = import.meta.env.VITE_API_URL ?
    (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`) :
    'http://localhost:5000/api';

// Extract the base domain for images (remove /api if present)
const imageBase = import.meta.env.VITE_IMAGE_BASE_URL ||
    (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'http://localhost:5000');

export const API_BASE_URL = apiTarget;
export const IMAGE_BASE_URL = imageBase;
