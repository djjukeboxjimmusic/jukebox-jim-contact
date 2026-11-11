const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUAc0QW42C_bZOU0Xtk5-YL-CBa6Mp6CBFZ6o2PGUHA22gMWUpXrQ0tNDONwDvvEolXiMdz0a3VdMP/pub?gid=0&single=true&output=csv";


/**
 * Returns the appropriate icon path based on event type name.
 */
function getEventIcon(eventType) {
  const name = (eventType || "").toLowerCase();
  if (name.includes("tune") || name.includes("name that")) {
    return "icon-tune.png";
  } else if (name.includes("bingo")) {
    return "icon-bingo.png";
  } else if (name.includes("trivia") || name.includes("quizzo")) {
    return "icon-trivia.png";
  } else if (name.includes("dj") || name.includes("party") || name.includes("dance")) {
    return "icon-dj.png";
  }
  return "icon-dj.png"; // Default fallback
}

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
	
	// ⭐ FALLBACK: No upcoming events
    if (futureEvents.length === 0) {
      const msg = document.createElement("div");
      msg.className = "no-events";
      msg.innerHTML = `
        <p><strong>No upcoming events.</strong></p>
      `;
      grid.appendChild(msg);
      return;
    }
	

    // Render
    futureEvents.forEach((ev, index) => {
      const box = document.createElement("div");
      box.className = "event-box";

      if (index === 0) box.classList.add("next-show");
	  
	  const iconPath = getEventIcon(ev.event);

      box.innerHTML = `
		<div class="event-icon-container">
          <img src="${iconPath}" alt="${ev.event} Icon" class="event-card-icon">
        </div>
        <h2>${ev.date}</h2>
        <p class="event-title"><strong>${ev.event}</strong></p>
        <p class="event-location">${ev.location}</p>
        <p class="event-time">${ev.time}</p>
      `;
      grid.appendChild(box);
    });
  });
