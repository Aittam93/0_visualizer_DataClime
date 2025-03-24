export function removeOldControl(customControl, map) {
  // Se esiste già un controllo, proviamo a rimuoverlo
  if (customControl) {
    map.removeControl(customControl);
  }

  // Forziamo la rimozione di eventuali container
  // personalizzati che sono rimasti nel DOM
  const oldContainers = document.querySelectorAll(".leaflet-control-custom");
  oldContainers.forEach((container) => container.remove());

  // Torniamo sempre null in modo che
  // la variabile customControl venga azzerata
  return null;
}
