import QRCode from "qrcode";

/**
 * Generates a base64 QR image from pass token
 * @param {string} token
 * @returns {Promise<string>} base64 image
 */
export const generateQrBase64 = async (token) => {
    try {
        const qr = await QRCode.toDataURL(token, {
            width: 300,
            margin: 2,
        });
        return qr; // data:image/png;base64,...
    } catch (error) {
        console.error("QR generation failed", error);
        throw error;
    }
};
