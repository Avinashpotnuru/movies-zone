export const COLLECTIONS = [
  {
    page: "hindi",
    label: "Hindi",
    name: "Hindi movies",
    code: "hi",
    region: "India · Hindi",
  },
  {
    page: "telugu",
    label: "Telugu",
    name: "Telugu movies",
    code: "te",
    region: "India · Telugu",
  },
  {
    page: "tamil",
    label: "Tamil",
    name: "Tamil movies",
    code: "ta",
    region: "India · Tamil",
  },
  {
    page: "kannada",
    label: "Kannada",
    name: "Kannada movies",
    code: "kn",
    region: "India · Kannada",
  },
  {
    page: "malayalam",
    label: "Malayalam",
    name: "Malayalam movies",
    code: "ml",
    region: "India · Malayalam",
  },
];

export const COLLECTION_BY_PAGE = COLLECTIONS.reduce((items, collection) => {
  items[collection.page] = collection;
  return items;
}, {});

export const getCollection = (page) => COLLECTION_BY_PAGE[page] || null;

export const COLLECTION_LINKS = COLLECTIONS.map(({ page, label }) => ({
  label,
  href: `/special/${page}`,
}));
