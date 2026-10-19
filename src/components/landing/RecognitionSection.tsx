const recognition = [
  { name: "Forbes", image: "forbes.webp" },
  { name: "Business Insider", image: "business-insider.webp" },
  { name: "The Denver Post", image: "denver-post.webp" },
  { name: "University of Colorado", image: "cu.webp" },
];

export default function RecognitionSection() {
  return (
    <section className="premium-wrap recognition-section" aria-labelledby="recognition-title">
      <p className="premium-eyebrow">A HISTORY OF TECHNOLOGY & INNOVATION</p>
      <h2 id="recognition-title">A founder with a recognized track record.</h2>
      <p>Our founder and his technology ventures have earned media coverage and university recognition.</p>
      <div className="recognition-logos">
        {recognition.map(({ name, image }) => (
          <div key={name}><img src={`/images/recognition/${image}`} alt={name} width="320" height="160" loading="lazy" /></div>
        ))}
      </div>
      <p className="premium-fine">Recognition relates to our founder and his technology ventures, including work before MasterGrowbot AI.</p>
    </section>
  );
}
