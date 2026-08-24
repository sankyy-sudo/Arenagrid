import { FaWhatsapp } from 'react-icons/fa';

export function WhatsAppButton() {
  const message = encodeURIComponent("Hello Arena Grid Infra, I would like to discuss a sports infrastructure project.");

  return (
    <a
      className="whatsapp-button"
      href={`https://wa.me/?text=${message}`}
      aria-label="Start a WhatsApp enquiry"
      target="_blank"
      rel="noreferrer"
    >
      <FaWhatsapp size={22} />
    </a>
  );
}
