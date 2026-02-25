const apiTarget = import.meta.env.VITE_API_URL ?
    (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`) :
    'http://localhost:5000/api';

export const API_BASE_URL = apiTarget;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || (import.meta.env.VITE_API_URL || 'http://localhost:5000');
