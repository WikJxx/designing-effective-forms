let clickCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  const countryInput = document.getElementById("country");
  const myForm = document.getElementById("form");
  const modal = document.getElementById("form-feedback-modal");
  const clicksInfo = document.getElementById("click-count");
  const invoiceCheckbox = document.getElementById("showInvoiceData");
  const invoiceSection = document.getElementById("invoiceSection");

  // Obsługa kliknięć
  document.addEventListener("click", () => {
    clickCount++;
    if (clicksInfo) clicksInfo.textContent = clickCount;
  });

  // Pokazywanie sekcji faktury
  invoiceCheckbox.addEventListener("change", () => {
    invoiceSection.style.display = invoiceCheckbox.checked ? "block" : "none";
  });

  // Obsługa Entera (poza textarea)
  myForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      myForm.requestSubmit();
    }
  });

  // Fetch krajów
  async function fetchAndFillCountries() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) throw new Error("Błąd pobierania danych");
      const data = await response.json();
      const countries = data.map(c => c.name.common).sort((a, b) => a.localeCompare(b));
      countryInput.innerHTML =
        '<option value="">Wybierz kraj</option>' +
        countries.map(c => `<option value="${c}">${c}</option>`).join("");
      $(countryInput).select2({
        placeholder: "Wybierz kraj",
        allowClear: true,
      });
    } catch (error) {
      console.error("Błąd:", error);
    }
  }

  // GeoIP
  function getCountryByIP() {
    fetch("https://get.geojs.io/v1/ip/geo.json")
      .then((res) => res.json())
      .then((data) => {
        const country = data.country;
        for (let opt of countryInput.options) {
          if (opt.value.toLowerCase() === country.toLowerCase()) {
            opt.selected = true;
            break;
          }
        }
        getCountryCode(country);
        $(countryInput).trigger("change");
      })
      .catch((err) => console.error("GeoJS error:", err));
  }

  function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const code = data[0].idd.root + (data[0].idd.suffixes?.[0] || "");
        const countryCodeSelect = document.getElementById("countryCode");
        for (let opt of countryCodeSelect.options) {
          if (opt.value === code) {
            opt.selected = true;
            break;
          }
        }
      })
      .catch((err) => console.error("Kod kierunkowy error:", err));
  }

  fetchAndFillCountries().then(getCountryByIP);
});
