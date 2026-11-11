import LazyRunway from "../experience/LazyRunway";

export default function Runway() {
  return (
    <section
      id="runway"
      className="runway"
      aria-labelledby="runway-title"
      tabIndex={-1}
    >
      <div className="runway-sticky">
        <div className="runway-heading">
          <p className="eyebrow">02 / THE RUNWAY</p>
          <h2 id="runway-title">
            The art of
            <br />
            <em>an entrance.</em>
          </h2>
        </div>
        <LazyRunway />
        <div className="runway-caption">
          <div>
            <p className="eyebrow">IN THE SPOTLIGHT</p>
            <h3>The Sovereign</h3>
            <p>Black. A gold peacock motif.</p>
            <small>Figure & bag: illustrative stand-ins</small>
          </div>
          <a className="text-link" href="#collection">
            Discover the collection <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
