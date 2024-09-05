document.getElementById("translateBtn").addEventListener("click", async () => {
  event.preventDefault();
  const inputText = document.getElementById("inputText").value;
  // console.log("Input text:", inputText); 

  if (inputText.trim() === "") {
    alert("Please enter some text to translate");
    return;
  }

  try {
    // console.log("Sending request with text:", inputText);

    const response = await fetch("/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),  // Send text as JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    document.getElementById("outputText").innerText = data.translatedText || "Translation failed";
    // console.log("Translation:", data.translatedText);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to translate text.");
  }
});
