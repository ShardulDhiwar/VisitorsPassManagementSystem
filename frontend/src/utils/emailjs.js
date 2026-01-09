import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_APPROVED = import.meta.env.VITE_EMAILJS_APPROVED_TEMPLATE;
const TEMPLATE_REJECTED = import.meta.env.VITE_EMAILJS_REJECTED_TEMPLATE;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendApprovedEmail = (data) => {
    return emailjs.send(
        SERVICE_ID,
        TEMPLATE_APPROVED,
        data,
        PUBLIC_KEY
    );
};

export const sendRejectedEmail = (data) => {
    return emailjs.send(
        SERVICE_ID,
        TEMPLATE_REJECTED,
        data,
        PUBLIC_KEY
    );
};
