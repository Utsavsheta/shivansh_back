export const slugify = (value: string): string => {
    return (value || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')   // replace non-alphanumerics with dash
        .replace(/^-+|-+$/g, '')      // trim dashes
        .replace(/-{2,}/g, '-');      // collapse multiple dashes
};

