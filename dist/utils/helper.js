"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generate a random password with uppercase, lowercase, digits, and special characters
 * @param length Length of the password (default: 12)
 */
const generateRandomPassword = (length = 12) => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specials = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    const all = upper + lower + digits + specials;
    let password = '';
    // Ensure at least one character from each set
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += specials[Math.floor(Math.random() * specials.length)];
    for (let i = 4; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }
    // Shuffle the password to avoid predictable order
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};
exports.default = {
    generateRandomPassword
};
