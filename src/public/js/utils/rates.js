export async function fetchRate(from, to) {
  try {
    const response = await fetch("http://localhost:5000/rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to }),
    });
    const data = await response.json();

    if (response.ok) {
      exRate.value = data.rate;
      calculateValues();
    } else {
      console.error("Error fetching rate:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
