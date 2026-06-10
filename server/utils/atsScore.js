export const calculateATSScore = (jdKeywords, resumeKeywords) => {
    const uniqueJD = [...new Set(jdKeywords)];

    const matches = uniqueJD.filter(keyword => resumeKeywords.includes(keyword));

    return Math.round((matches.length / uniqueJD.length) * 100);
}