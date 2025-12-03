// the-one-api key: d-cbR2FdYIeT07IgfIol

// ------------------------------
// CLASS with STATIC method
// ------------------------------
class QuoteFetcher {
    static async getQuotesByCharacter(name) {
        const apiKey = "d-cbR2FdYIeT07IgfIol";  // <-- Insert your key

        const res = await fetch(`https://the-one-api.dev/v2/character?name=${name}`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });

        const data = await res.json();

        if (data.docs.length === 0) {
            throw new Error("Character not found");
        }

        const characterId = data.docs[0]._id;

        // Fetch quotes by character ID
        const quoteRes = await fetch(`https://the-one-api.dev/v2/quote?character=${characterId}`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });

        const quoteData = await quoteRes.json();

        if (quoteData.docs.length === 0) {
            throw new Error("No quotes found for this character");
        }

        // Return a random quote
        const randomQuote = quoteData.docs[Math.floor(Math.random() * quoteData.docs.length)];
        return {
            name: data.docs[0].name,
            quote: randomQuote.dialog
        };
    }
}


// DOM ELEMENTS
const form = document.getElementById("quote-form");
const charInput = document.getElementById("character");
const errorMessage = document.getElementById("error-message");
const nameBox = document.getElementById("character-name");
const quoteBox = document.getElementById("quote-text");


// ------------------------------
// INTERACTIVITY + EVENT LISTENER
// ------------------------------
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorMessage.textContent = "";

    const name = charInput.value.trim();

    // Validation
    if (name === "") {
        errorMessage.textContent = "Please enter a character name.";
        return;
    }

    // Save last search
    localStorage.setItem("lastCharacter", name);

    try {
        const result = await QuoteFetcher.getQuotesByCharacter(name);
        nameBox.textContent = result.name;
        quoteBox.textContent = `"${result.quote}"`;
    }
    catch (err) {
        nameBox.textContent = "";
        quoteBox.textContent = "";
        errorMessage.textContent = err.message;
    }
});


// ------------------------------
// LOAD previous search (localStorage)
// ------------------------------
window.addEventListener("load", () => {
    const last = localStorage.getItem("lastCharacter");
    if (last) {
        charInput.value = last;
    }
});
