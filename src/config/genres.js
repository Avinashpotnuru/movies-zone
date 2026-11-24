export const GENRE_NOTES = {
  28: "Big-scale stories, relentless pace and the films that keep you on the edge of your seat.",
  12: "Epic journeys, impossible worlds and the thrill of the unknown.",
  16: "Animated worlds with heart, humour and a little bit of magic.",
  35: "Sharp jokes, awkward moments and the comedies worth rewatching.",
  80: "Criminal minds, moral lines and the cases that never let go.",
  18: "Human stories, honest performances and the films that stay with you.",
  27: "Dark corners, loud scares and the thrill of being genuinely unsettled.",
  878: "Future worlds, bold ideas and cinema that asks what comes next.",
  53: "Twists, tension and stories that refuse to give you a easy answer.",
};

export const getGenreNote = (genre) =>
  GENRE_NOTES[genre?.id] ||
  (genre?.name
    ? `A hand-picked feed of ${genre.name.toLowerCase()} films — the titles people keep coming back to.`
    : "A hand-picked feed of films from TMDB.");
