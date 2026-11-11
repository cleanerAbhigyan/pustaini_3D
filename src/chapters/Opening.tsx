export default function Opening() {
  return (
    <section
      id="opening"
      className="opening"
      aria-labelledby="opening-title"
      tabIndex={-1}
    >
      <div className="opening-rule" aria-hidden="true" />
      <div className="monogram" aria-hidden="true">
        P<span>✧</span>
      </div>
      <p className="eyebrow">THE HOUSE OF PUSTAINI</p>
      <h1 id="opening-title">
        A presence,
        <br />
        <em>unmistakable.</em>
      </h1>
      <p className="opening-note">An invitation to enter our world.</p>
      <a className="text-link opening-enter" href="#house-film">
        Enter the experience <span aria-hidden="true">↓</span>
      </a>
      <div className="opening-bottom">
        <span>A STUDY IN PRESENCE</span>
        <span>SCROLL TO DISCOVER</span>
        <span>01 — 04</span>
      </div>
    </section>
  );
}
