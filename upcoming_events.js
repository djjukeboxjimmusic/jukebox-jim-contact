const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUAc0QW42C_bZOU0Xtk5-YL-CBa6Mp6CBFZ6o2PGUHA22gMWUpXrQ0tNDONwDvvEolXiMdz0a3VdMP/pub?gid=0&single=true&output=csv";


/**
 * Parse Google Sheets formatted dates like:
 * "Thu Oct 1"
 * "Tue Oct 6"
 * "Fri Nov 6"
 *
 * Removes hidden characters and forces year 2026.
 */
function parseSheetDate(str) {
  // Remove CR, tabs, double spaces, unicode junk
  const clean = str.replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
  // clean example: "Thu Oct 1"

  const parts = clean.split(" "); // ["Thu", "Oct", "1"]
  if (parts.length < 3) return new Date(NaN);

  const month = parts[1];
  const day = parts[2];
  const year = 2026;

  return new Date(`${month} ${day}, ${year}`);
}

fetch(sheetURL)
  .then((response) => response.text())
  .then((csv) => {
    const rows = csv.split("\n").slice(1); // skip header
    const grid = document.getElementById("event-grid");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize

    let futureEvents = [];

    rows.forEach((row) => {
      const [date, time, location, event] = row.split(",");

      if (!date) return;

      const eventDate = parseSheetDate(date);

      // Filter out invalid or past dates
      if (isNaN(eventDate.getTime()) || eventDate < today) return;

      futureEvents.push({
        date,
        time,
        location,
        event,
        eventDate,
      });
    });

    // Sort future events chronologically
    futureEvents.sort((a, b) => a.eventDate - b.eventDate);

    // Render
    futureEvents.forEach((ev, index) => {
      const box = document.createElement("div");
      box.className = "event-box";

      if (index === 0) box.classList.add("next-show");

      box.innerHTML = `
        <h2>${ev.date}</h2>
        <p><strong>${ev.event}</strong></p>
        <p>${ev.location}</p>
        <p>${ev.time}</p>
      `;

      grid.appendChild(box);
    });
  });
