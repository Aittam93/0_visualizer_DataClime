# SDG-Eyes Dashboard

## Descrizione

Questa applicazione rappresenta una dashboard interattiva sviluppata come parte del **Pilot 2** del progetto SDGs-Eyes. La dashboard visualizza indicatori di pericolo, esposizione e vulnerabilità per la popolazione over 65 nella città di Torino, fornendo strumenti di analisi basati su mappe e grafici a livello di sezione di censimento.

## Caratteristiche Principali

- **Visualizzazione della mappa interattiva** basata su Leaflet.
- **Grafici dinamici (torta e barre)** per rappresentare i dati selezionati.
- **Selettore interattivo** per scegliere indicatori specifici da analizzare.
- **Integrazione con un database PostgreSQL** per il caricamento dei dati GeoJSON.
- **Docker Compose** per gestire l'applicazione e il database come container.

---

## Requisiti

- **Node.js**: v16 o superiore
- **PostgreSQL**: v13 o superiore (gestito tramite Docker)
- **Librerie front-end**:

  - Leaflet
  - Chart.js

- **Docker** e **Docker Compose**

---

## Struttura del Progetto

### Backend

- **`server.js`**: Punto di ingresso per il server Node.js.
- **`app.js`**: Configurazione del server Express e definizione delle rotte principali.
- **`routes/maps.router.js`**: Gestione delle rotte per le richieste GeoJSON.
- **`controllers/maps.controller.js`**: Logica per il recupero dei dati dal database.
- **`middlewares/validateTable.js`**: Middleware per validare i nomi delle tabelle.
- **`config/db.js`**: Configurazione della connessione al database PostgreSQL.

### Frontend

- **`index.html`**: Struttura principale della pagina.
- **`css/style.css`**: Stili personalizzati.
- **`js/calculateBreaks.js`**: Logica per la tematizzazione delle mappe.
- **`js/chart.js`**: Gestisce i grafici.
- **`js/config.js`**: Nomi delle variabili e altre configurazioni.
- **`js/createCustomControl.js`**: Crea il radio button per il toggle delle mappe di esposizione, pericolo, vulnerabilità e rischio.
- **`js/createOverlayLayers.js`**: Gestisce le mappe caricate in overlay (al click sulla colonna del barchart).
- **`js/fetchGeoJson.js`**: chiama il server per ottenere i dati geojson.
- **`js/geoJsonLoader.js`**: carica il geojson e gestisce i controlli.
- **`js/getStyleByAttribute.js`**: assegna gli stili (dparametri definiti su config.js).
- **`js/map.js`**: orchestra le funzioni di controllo della mappa e dei grafici.
- **`js/prepareValuesByAttribute.js`**: prepara l'oggetto con gli array di valori. Usato da geoJsonLoader.js
- **`js/removeOldControl.js`**: ripulisce del vecchio radio button
- **`js/resetVisualization.js`**: rresetta il piechart e il barchart

### Database

Il database contiene tabelle GeoJSON con informazioni spaziali e metadati. Le tabelle supportate includono:

- `sdgeyes_Tappmax`: Temperatura massima apparente.
- `sdgeyes_Hw`: Ondate di caldo.
- `sdgeyes_Su`: Giornate estive.
- `sdgeyes_Tr`: Notti tropicali.

---

## Installazione

### 1. Clonare il repository

```bash
$ git clone <URL-del-repository>
$ cd <nome-cartella-repository>
```

### 2. Configurare le variabili d'ambiente

Creare un file `.env` nella root del progetto con il seguente contenuto:

```env
DB_USER=postgres
DB_PASS=postgres
DB_HOST=db
DB_NAME=pilot2
DB_PORT=5432
PORT=3000
```

### 3. Avviare i container Docker

Costruire e avviare i container per l'applicazione e il database:

```bash
$ docker-compose up -d --build
```

Questo comando avvierà:

- **App**: Disponibile su [http://localhost:3000](http://localhost:3000).
- **Database**: Un container PostgreSQL con estensione PostGIS.

### 4. Importare il database

Assicurarsi che il file `dump.sql` sia presente nella directory del progetto. Importare il dump nel database:

```bash
$ docker exec -i sdgs_eyes_pilot_2-db-1 psql -U postgres -d pilot2 < dump.sql
```

---

## Uso dell'Applicazione

1. **Accedere alla dashboard**:
   Aprire un browser e navigare su [http://localhost:3000](http://localhost:3000).

2. **Selezionare un indicatore**:
   Utilizzare il selettore in alto a destra per scegliere l'indicatore desiderato.

3. **Interagire con la mappa**:
   Fare clic sulle feature per visualizzare dettagli nei grafici a torta e a barre.

---

## Tecnologie Utilizzate

- **Frontend**: Leaflet, Chart.js, Bootstrap.
- **Backend**: Node.js, Express.
- **Database**: PostgreSQL con estensione PostGIS.
- **Containerizzazione**: Docker e Docker Compose.

---

## Manutenzione e Contributi

Tbd.

---

## Licenza

Tbd.
