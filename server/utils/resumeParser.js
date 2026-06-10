import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export  async function parseResume(fileBuffer) {
    try {
        if (!fileBuffer || fileBuffer.length === 0) {
            throw new Error("Invalid file buffer");
        }

        const uint8Array = new Uint8Array(fileBuffer);

        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        let extractedText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");

            extractedText += pageText + "\n";
        }

        return extractedText;

    } catch (error) {
        console.error("Error parsing resume:", error);
        throw error;
    }
}