export default function HouseFilm() {
  return (
    <section
      id="house-film"
      className="house-film chapter-padding"
      aria-labelledby="film-title"
      tabIndex={-1}
    >
      <div className="section-heading">
        <p className="eyebrow">01 / THE HOUSE FILM</p>
        <h2 id="film-title">
          Before a word.
          <br />
          <em>An impression.</em>
        </h2>
      </div>
      <figure className="film-frame">
        <div className="film-curtain" aria-hidden="true">
          <span>P</span>
        </div>
        <div className="film-caption">
          <span className="eyebrow">PUSTAINI / A MOTION STUDY</span>
          <p>The house film</p>
          <span>Film placeholder · Awaiting the approved film</span>
        </div>
        <figcaption className="sr-only">
          A burgundy curtain treatment reserves the frame for the Pustaini house
          film. No footage is currently available.
        </figcaption>
      </figure>
      <div className="film-bottom">
        <p>A moment before the entrance.</p>
        <a className="text-link" href="#runway">
          Take your front-row seat <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
