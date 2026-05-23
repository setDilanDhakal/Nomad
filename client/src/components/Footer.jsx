import {
  FaBalanceScale,
  FaCode,
  FaCreditCard,
  FaCubes,
  FaHandshake,
  FaLink,
} from "react-icons/fa";

const PlausibleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path strokeWidth="2" d="M4 8.5V23c3 0 6-3 6-5.5h2.5c4 0 7.5-4 7.5-9 0-3-3-7.5-8-7.5S4 5.5 4 8.5Z" />
  </svg>
);

const MatomoIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      strokeMiterlimit="1.4"
      strokeWidth="2"
      d="m13.8 16.3.8.6v-.1l.2-.2a164.4 164.4 0 0 1 .6-.9l.9 1a4.1 4.1 0 0 0 5.3.4c1-.7 1.3-1.8 1.3-2.8 0-1-.5-2-1-2.8l-3-5A3 3 0 0 0 16 5c-.9 0-1.6.3-2 .5-.8.4-1.3 1-1.7 1.8l-1-1.1-.7.7.6-.7a5 5 0 0 0-3-1.3c-1.1 0-2.3.3-3 1.4L1.7 12a4.7 4.7 0 0 0-.7 3.1 4 4 0 0 0 1.2 2c1 .8 2.3.9 3.4.7 1-.2 2.3-.8 2.8-1.9l1 .8a3.6 3.6 0 0 0 3.5 1.2 3.8 3.8 0 0 0 1.5-.9l-.6-.7Zm0 0 .7.7v-.1l-.7-.6Z"
    />
  </svg>
);

const GoogleAnalyticsIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path d="M17 5.1v13.5c0 1.6 1 2.4 2 2.4s2-.7 2-2.4V5.2C21 4 20 3 19 3s-2 1-2 2.1Zm-7 7v6.6c0 1.5 1 2.3 2 2.3s2-.7 2-2.3v-6.5c0-1.3-1-2.2-2-2.2s-2 1-2 2.1Zm-3.6 8.3a2 2 0 1 0-2.8-2.8 2 2 0 0 0 2.8 2.8Z" />
  </svg>
);

function Footer() {
  const brand = {
    name: "NOMAD.",
    description: "Raw Essence — Winter Archive 2026",
  };

  const socialLinks = [
    { name: "Twitter", href: "#" },
    { name: "Github", href: "#" },
    { name: "Discord", href: "#" },
  ];

  const columns = [
    {
      title: "Product",
      links: [
        { name: "Features", Icon: FaCubes, href: "#features" },
        { name: "Pricing", Icon: FaCreditCard, href: "#pricing" },
        { name: "Integrations", Icon: FaLink, href: "#integrations" },
        { name: "API Documentation", Icon: FaCode, href: "#docs" },
      ],
    },
    {
      title: "Compare",
      links: [
        { name: "Plausible", Icon: PlausibleIcon, href: "#" },
        { name: "Matomo", Icon: MatomoIcon, href: "#" },
        { name: "Google Analytics", Icon: GoogleAnalyticsIcon, href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", Icon: FaBalanceScale, href: "#" },
        { name: "Terms of Service", Icon: FaHandshake, href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-black/90 text-white">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <a href="#" className="text-2xl italic font-bold tracking-wide text-neon">
              {brand.name}
            </a>
            <p className="mt-2 text-sm text-white/70">{brand.description}</p>
            <p className="text-sm text-white/60 mt-3.5">
              {socialLinks.map((link, index) => (
                <span key={link.name}>
                  <a className="hover:text-neon" target="_blank" href={link.href} rel="noopener noreferrer">
                    {link.name}
                  </a>
                  {index < socialLinks.length - 1 && " • "}
                </span>
              ))}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-8 lg:justify-items-end gap-8">
            {columns.map(({ title, links }) => (
              <div key={title}>
                <h3 className="text-sm font-semibold text-neon">{title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href || "#"} className="text-sm text-white/70 hover:text-neon group">
                        <link.Icon className="inline h-4 mr-1.5 text-white/70 group-hover:text-neon" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 pb-5">
          <p className="text-xs text-neon">© 2026 NOMAD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

