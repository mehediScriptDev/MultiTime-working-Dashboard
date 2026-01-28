// Small helpers for charts
export function getColorFromConfig(itemConfig, theme = "light") {
  return itemConfig?.theme?.[theme] || itemConfig?.color || null
}

export function formatLegendLabel(itemConfig, fallback) {
  return itemConfig?.label || fallback
}

export default { getColorFromConfig, formatLegendLabel }
