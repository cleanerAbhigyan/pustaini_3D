import { collection } from "../content/chapters";

export default function Collection() {
  return (
    <section
      id="collection"
      className="collection chapter-padding"
      aria-labelledby="collection-title"
      tabIndex={-1}
    >
      <div className="collection-arch" aria-hidden="true">
        <span>PUSTAINI</span>
      </div>
      <div className="collection-intro">
        <p className="eyebrow">03 / THE COLLECTION</p>
        <h2 id="collection-title">
          A closer
          <br />
          <em>acquaintance.</em>
        </h2>
        <p>The Sovereign, in focus.</p>
      </div>
      <div className="catalogue">
        {collection.map((product) => (
          <article
            id={product.id}
            key={product.id}
            className="product"
            aria-labelledby={`${product.id}-title`}
            tabIndex={-1}
          >
            <a
              className="product-image"
              href={`#${product.id}-details`}
              aria-label={`View ${product.name} in the catalogue`}
            >
              <img
                src={product.image}
                alt={product.imageAlt}
                width="600"
                height="500"
                loading="lazy"
              />
              <span>ILLUSTRATIVE STAND-IN</span>
              <span className="product-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <div
              id={`${product.id}-details`}
              className="product-details"
              tabIndex={-1}
            >
              <div>
                <p className="eyebrow">PUSTAINI</p>
                <h3 id={`${product.id}-title`}>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <span className="product-number">01</span>
            </div>
          </article>
        ))}
      </div>
      <p className="catalogue-note">
        A first look. Further collection pieces will be introduced here.
      </p>
    </section>
  );
}
