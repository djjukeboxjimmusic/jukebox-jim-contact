const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUAc0QW42C_bZOU0Xtk5-YL-CBa6Mp6CBFZ6o2PGUHA22gMWUpXrQ0tNDONwDvvEolXiMdz0a3VdMP/pub?gid=0&single=true&output=csv";

function parseSheetDate(str) {
  // Example: "Thu Oct 1"
  const parts = str.trim().split(" "); // ["Thu", "Oct", "1"]
  const month = parts[1];
  const day = parts[2];

  // Force year 2026
  const year = 2026;

  return new Date(`${month} ${day}, ${year}`);
}


fetch(sheetURL)
  .then(response => response.text())
  .then(csv => {
    const rows = csv.split("\n").slice(1); // skip header
    const grid = document.getElementById("event-grid");

	const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize
	
	let futureEvents = [];

	rows.forEach(row => {
	  const [date, time, location, event] = row.split(",");

	  const eventDate = parseSheetDate(date);
	  if (isNaN(eventDate.getTime()) || eventDate < today) return;

	  futureEvents.push({ date, time, location, event });
	});

	// Now render
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
