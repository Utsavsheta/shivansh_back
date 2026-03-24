"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = void 0;
const slugify = (value) => {
    return (value || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumerics with dash
        .replace(/^-+|-+$/g, '') // trim dashes
        .replace(/-{2,}/g, '-'); // collapse multiple dashes
};
exports.slugify = slugify;
