$(document).ready(function () {
  // Function to copy the quote to the clipboard
  function copyQuote() {
    const quoteText = $("#quote").text() + " " + $("#author").text();
    navigator.clipboard
      .writeText(quoteText)
      .then(() => {
        alert("Quote copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
        alert("Failed to copy quote.");
      });
  }

  // Function to download the quote card as PNG
  function saveQuote() {
    const quoteCard = $("#quote-card");

    // Check if the quoteCard is visible and attached to the DOM
    if (!quoteCard.length || !document.contains(quoteCard[0])) {
      alert("The quote card is not available for capture.");
      return;
    }

    // Apply rounded corners directly to the element before capturing
    quoteCard.css("border-radius", "20px");
    quoteCard.css("overflow", "hidden");

    // Capture the content of the quote-card using html2canvas
    html2canvas(quoteCard, {
      backgroundColor: null, // No background color
      useCORS: true, // Enable CORS for external resources
      allowTaint: true, // Allow tainted resources (cross-origin images)
    })
      .then((canvas) => {
        // Convert the canvas to a data URL (PNG format)
        const dataUrl = canvas.toDataURL("image/png");

        // Create an anchor element for the download link
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "quote.png"; // Set the download file name

        // Trigger the download
        link.click();

        // Reset styles after saving
        quoteCard.css("border-radius", "");
        quoteCard.css("overflow", "");
      })
      .catch((error) => {
        console.error("Error capturing the quote card:", error);
        alert("Error capturing the quote card.");
      });
  }

  // Function to fetch a random quote from the API
  function fetchQuote() {
    $.ajax({
      url: "https://dummyjson.com/quotes", // Random quote API
      method: "GET",
      success: function (data) {
        const randomQuote =
          data.quotes[Math.floor(Math.random() * data.quotes.length)]; // Get a random quote
        $("#quote").text(`"${randomQuote.quote}"`); // Update the quote
        $("#author").text(`- ${randomQuote.author}`); // Update the author
      },
      error: function () {
        $("#quote").text("Oops! Couldn't fetch a quote. Try again.");
        $("#author").text("");
      },
    });
  }

  // Fetch a quote on page load
  fetchQuote();

  // Event listener for the "Get New Quote" button
  $("#new-quote").click(() => {
    fetchQuote();
  });

  // Event listener for the "Download Quote" button
  $("#download-quote").click(() => {
    saveQuote();
  });

  // Event listener for the "Copy Quote" button
  $("#copy-quote").click(() => {
    copyQuote();
  });
});
