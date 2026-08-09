// Escape user-supplied text before embedding it in a RegExp so special
// characters are matched literally instead of being interpreted as syntax.
const escapeRegex = (text = "") =>
  String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = { escapeRegex };
