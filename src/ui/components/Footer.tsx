export function Footer() {
  const columns = [
    {
      title: "Company",
      links: [
        ["About", "/about"],
        ["Services", "/services"],
        ["Projects", "/projects"],
        ["Case Studies", "/case-studies"]
      ]
    },
    {
      title: "Solutions",
      links: [
        ["Products", "/products"],
        ["Sports", "/sports"],
        ["Industries", "/industries"],
        ["Resources", "/resources"]
      ]
    },
    {
      title: "Contact",
      links: [
        ["Get Quote", "/contact"],
        ["WhatsApp", "https://wa.me/?text=Hello%20Arena%20Grid%20Infra%2C%20I%20want%20to%20discuss%20a%20project."],
        ["Project Enquiry", "/contact"],
        ["Support", "/contact"]
      ]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="brand-mark">AG</span>
        <div>
          <strong>ARENA GRID INFRA</strong>
          <p>Premium sports infrastructure planning, construction, installation and maintenance.</p>
        </div>
      </div>
      <div className="footer-links" aria-label="Footer navigation">
        {columns.map(({ title, links }) => (
          <div key={title}>
            <strong>{title}</strong>
            {links.map(([link, href]) => (
              <a key={link} href={href}>
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-meta">
        <span>BUILDING SPACES</span>
        <span>ENHANCING PLAY</span>
        <span>BUILDING FUTURES</span>
      </div>
    </footer>
  );
}
