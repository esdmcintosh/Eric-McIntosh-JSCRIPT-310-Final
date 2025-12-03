// CLASS EXAMPLE USING A STATIC METHOD
class ShipFormatter {
    static format(shipObj) {
        return `
            <div class="ship-card">
                <h2>${shipObj.name}</h2>
                <p><strong>Registry:</strong> ${shipObj.registry || "Unknown"}</p>
                <p><strong>Status:</strong> ${shipObj.status?.description || "Unknown"}</p>
                <p><strong>Operator:</strong> ${shipObj.operator?.name || "Unknown"}</p>
            </div>
        `;
    }
}

const form = document.getElementById("ship-form");
const input = document.getElementById("ship-input");
const results = document.getElementById("results");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const query = input.value.trim();
    if (!query) {
        results.innerHTML = "<p>Please enter a ship name.</p>";
        return;
    }

    results.innerHTML = "<p>Searching...</p>";

    try {
        const response = await fetch("https://stapi.co/api/v1/rest/spacecraft/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: query })
        });

        const data = await response.json();

        if (!data.spacecrafts || data.spacecrafts.length === 0) {
            results.innerHTML = `<p>No results found for "${query}".</p>`;
            return;
        }

        // Show results
        results.innerHTML = "<h2>Results:</h2>";
        data.spacecrafts.forEach(ship => {
            results.innerHTML += ShipFormatter.format(ship);
        });

    } catch (error) {
        results.innerHTML = "<p>Error fetching data. Check console.</p>";
        console.error(error);
    }
});
