import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-ink-deep text-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold">Horizons</span>
              <span className="mb-1 inline-block h-2 w-2 bg-klein" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
              A contemporary gallery for collectors and the simply curious —
              original artworks, living artists, and exhibitions worth leaving
              the house for.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/55">
              Explore
            </p>
            <nav className="flex flex-col gap-3">
              <Link className="text-sm text-paper/80 transition-colors hover:text-paper" to="/">
                Home
              </Link>
              <Link className="text-sm text-paper/80 transition-colors hover:text-paper" to="/artworks">
                Artworks
              </Link>
              <Link className="text-sm text-paper/80 transition-colors hover:text-paper" to="/exhibitions">
                Exhibitions
              </Link>
              <Link className="text-sm text-paper/80 transition-colors hover:text-paper" to="/about">
                About
              </Link>
            </nav>
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/55">
              Contact
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                className="text-paper/80 transition-colors hover:text-paper"
                href="mailto:support@artgallery.com"
              >
                support@artgallery.com
              </a>
              <p className="text-paper/60">Open daily, 10:00 — 19:00</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-paper/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-paper/55">
            © 2026 Horizons. All rights reserved.
          </p>
          <p className="font-display text-sm italic text-paper/55">
            Art enables us to find ourselves and lose ourselves at the same time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
