export const extractKeywords = (text) => {
    return text
    .toLowerCase()
    .match(/\b[a-z]{3,}\b/g) || []; // Match words with 3 or more letters
};