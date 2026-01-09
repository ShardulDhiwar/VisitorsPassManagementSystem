import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const APPROVED_TEMPLATE = import.meta.env.VITE_EMAILJS_APPROVED_TEMPLATE;
const REJECTED_TEMPLATE = import.meta.env.VITE_EMAILJS_REJECTED_TEMPLATE;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendApprovedEmail = (data) => {
    return emailjs.send(
        SERVICE_ID,
        APPROVED_TEMPLATE,
        data,
        PUBLIC_KEY
    );
};

export const sendRejectedEmail = (data) => {
    return emailjs.send(
        SERVICE_ID,
        REJECTED_TEMPLATE,
        data,
        PUBLIC_KEY
    );
};
