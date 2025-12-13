// the-one-api key: d-cbR2FdYIeT07IgfIol

// ------------------------------
// CLASS with STATIC method
// ------------------------------
class QuoteFetcher {
    static async getQuotesByCharacter(name) {
        const apiKey = "d-cbR2FdYIeT07IgfIol"; // <-- YOUR API KEY HERE

        // Fetch ALL characters (API name search is accent-sensitive)
        const res = await fetch(
            "https://the-one-api.dev/v2/character",
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`
                }
            }
        );

        const data = await res.json();

        if (!data.docs || data.docs.length === 0) {
            throw new Error("No characters returned from API");
        }

        // Normalize strings (remove accents, lowercase)
        const normalize = str =>
            str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

        const inputName = normalize(name);

        // Match characters manually
        const matches = data.docs.filter(char =>
            normalize(char.name).includes(inputName)
        );

        if (matches.length === 0) {
            throw new Error("Character not found");
        }

        // Try each matching character until one has quotes
        for (const character of matches) {
            const quoteRes = await fetch(
                `https://the-one-api.dev/v2/quote?character=${character._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`
                    }
                }
            );

            const quoteData = await quoteRes.json();

            if (quoteData.docs && quoteData.docs.length > 0) {
                const randomQuote =
                    quoteData.docs[Math.floor(Math.random() * quoteData.docs.length)];

                return {
                    name: character.name,
                    quote: randomQuote.dialog
                };
            }
        }

        throw new Error("No quotes found for this character");
    }
}


// ------------------------------
// DOM ELEMENTS
// ------------------------------
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
    } catch (err) {
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
