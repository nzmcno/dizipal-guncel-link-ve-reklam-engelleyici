document.addEventListener("DOMContentLoaded", () => {
  const toggleAdBlockButton = document.getElementById("toggleAdBlock");
  const openDizipalButton = document.getElementById("openDizipal");
  const adBlockDurationInput = document.getElementById("adBlockDuration");
  const maxTriesInput = document.getElementById("maxTries");
  const saveDurationButton = document.getElementById("saveDuration");
  const saveMaxTriesButton = document.getElementById("saveMaxTries");

  // API URL ve sabit URL
  const apiUrl = "https://raw.githubusercontent.com/dizipaltv/api/main/dizipal.json";
  const fixedUrl = "https://dizipa845.com";

  // Reklam engelleyici durumunu ve ayarları yükle
  chrome.storage.local.get(["adBlockEnabled", "adBlockDuration", "maxTries"], (result) => {
    const isEnabled = result.adBlockEnabled ?? true; // Varsayılan açık
    const duration = result.adBlockDuration ?? 2; // Varsayılan süre: 2 dakika
    const maxTries = result.maxTries ?? 6; // Varsayılan deneme sayısı: 6
    updateAdBlockButton(isEnabled);
    adBlockDurationInput.value = duration;
    maxTriesInput.value = maxTries;
  });

  // Reklam engelleyici butonuna tıklama işlevi
  toggleAdBlockButton.addEventListener("click", () => {
    chrome.storage.local.get(["adBlockEnabled"], (result) => {
      const isEnabled = !result.adBlockEnabled;
      chrome.storage.local.set({ adBlockEnabled: isEnabled }, () => {
        updateAdBlockButton(isEnabled);
      });
    });
  });

  // "Dizipal’i Aç" butonuna tıklama işlevi
  openDizipalButton.addEventListener("click", async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      const currentSiteURL = data.currentSiteURL || fixedUrl; // Sabit URL kullanımı
      chrome.tabs.create({ url: currentSiteURL });
    } catch (error) {
      console.error("API hatası:", error);
      alert("Site URL alınırken bir hata oluştu! Sabit URL'ye yönlendiriliyor.");
      chrome.tabs.create({ url: fixedUrl }); // API hatasında sabit URL'ye yönlendir
    }
  });

  // Süre ayarını kaydetme işlevi
  saveDurationButton.addEventListener("click", () => {
    const duration = parseInt(adBlockDurationInput.value, 10);
    if (duration >= 1 && duration <= 10) {
      chrome.storage.local.set({ adBlockDuration: duration }, () => {
        alert(`Süre ${duration} dakika olarak kaydedildi.`);
      });
    } else {
      alert("Lütfen 1 ile 10 arasında bir değer girin.");
    }
  });

  // Maksimum deneme sayısını kaydetme işlevi
  saveMaxTriesButton.addEventListener("click", () => {
    const maxTries = parseInt(maxTriesInput.value, 10);
    if (maxTries >= 1 && maxTries <= 10) {
      chrome.storage.local.set({ maxTries }, () => {
        alert(`Maksimum reklam sayısı ${maxTries} olarak kaydedildi.`);
      });
    } else {
      alert("Lütfen 1 ile 10 arasında bir değer girin.");
    }
  });

  // Reklam engelleyici durumunu güncelle
  function updateAdBlockButton(isEnabled) {
    toggleAdBlockButton.textContent = `Reklam Engelleyici: ${isEnabled ? "Açık" : "Kapalı"}`;
  }
});
