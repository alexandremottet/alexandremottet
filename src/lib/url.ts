export const url = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
