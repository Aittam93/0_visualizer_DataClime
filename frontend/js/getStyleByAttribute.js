// getSytleByAttribute.js

/**
 * assegna lo stile (da config.js) e prepara uno stile neutro in caso di errore.
 *
 */

export function getStyleByAttribute(attribute, value, breaks, styleRanges) {
  const style = styleRanges[attribute];
  if (style) {
    const { colors, fillOpacity, weight } = style;
    const index = breaks.findIndex(
      (b, i) => value >= b && value < breaks[i + 1]
    );
    return {
      fillColor: colors[Math.max(0, index)],
      color: "white",
      fillOpacity,
      weight,
    };
  }
  return { fillColor: "#cccccc", color: "white", fillOpacity: 1, weight: 1 };
}
