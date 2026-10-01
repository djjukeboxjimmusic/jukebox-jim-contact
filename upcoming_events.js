const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUAc0QW42C_bZOU0Xtk5-YL-CBa6Mp6CBFZ6o2PGUHA22gMWUpXrQ0tNDONwDvvEolXiMdz0a3VdMP/pub?gid=0&single=true&output=csv";

fetch(sheetURL)
  .then(response => response.text())
  .then(csv => {
    const rows = csv.split("\n").slice(1); // skip header
    const grid = document.getElementById("event-grid");

    rows.forEach(row => {
      const [date, time, location, event] = row.split(",");

      if (!date) return;

      const box = document.createElement("div");
      box.className = "event-box";
	  if (index === 0) box.classList.add("next-show");

      box.innerHTML = `
        <h2>${date}</h2>
        <p><strong>${event}</strong></p>
        <p>${location}</p>
        <p>${time}</p>
      `;

      grid.appendChild(box);
    });
  });