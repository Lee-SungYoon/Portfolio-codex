const socialLinks = ["Behance", "Dribbble", "Instagram", "LinkedIn"];

export default function SocialLinks() {
  return (
    <div className="socials" aria-label="Social links">
      {socialLinks.map((item) => (
        <a className="text-link" href="#" key={item}>
          {item}
        </a>
      ))}
    </div>
  );
}
