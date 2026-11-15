/** Resolve public files under either an origin root or a project-hosting path. */
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
