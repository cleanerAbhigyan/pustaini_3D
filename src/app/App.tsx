import Opening from "../chapters/Opening";
import HouseFilm from "../chapters/HouseFilm";
import Runway from "../chapters/Runway";
import Collection from "../chapters/Collection";
import Footer from "../chapters/Footer";
import { chapters } from "../content/chapters";
import { useChapterScroll } from "../experience/scroll";

export default function App() {
  useChapterScroll();
  return (
    <>
      <a href="#collection" className="skip-link">
        Skip to collection
      </a>
      <header className="header">
        <a
          className="wordmark"
          href="#opening"
          aria-label="Pustaini, return to opening"
        >
          PUSTAINI
        </a>
        <nav aria-label="Chapters">
          {chapters.map((chapter, i) => (
            <a key={chapter.id} data-chapter-link href={`#${chapter.id}`}>
              <span className="nav-number">0{i + 1}</span>
              <span>{chapter.label}</span>
            </a>
          ))}
        </nav>
      </header>
      <main>
        <Opening />
        <HouseFilm />
        <Runway />
        <Collection />
      </main>
      <Footer />
      <div id="chapter-blink" aria-hidden="true">
        <div />
        <div />
      </div>
    </>
  );
}
