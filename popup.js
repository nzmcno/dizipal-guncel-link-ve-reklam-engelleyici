document.addEventListener("DOMContentLoaded", () => {
  const toggleAdBlockButton = document.getElementById("toggleAdBlock");
  const openDizipal1Button = document.getElementById("openDizipal1");
  const openDizipal2Button = document.getElementById("openDizipal2");
  const openDizipal3Button = document.getElementById("openDizipal3");
  const openDizipal4Button = document.getElementById("openDizipal4");
  const openDizipal5Button = document.getElementById("openDizipal5");
  const adBlockDurationInput = document.getElementById("adBlockDuration");
  const maxTriesInput = document.getElementById("maxTries");
  const saveDurationButton = document.getElementById("saveDuration");
  const saveMaxTriesButton = document.getElementById("saveMaxTries");

  // API URL'leri ve sabit URL
  const apiUrl1 = "https://raw.githubusercontent.com/dizipaltv/api/main/dizipal.json";
  const apiUrl3 = "https://raw.githubusercontent.com/nzmcno/dizipal-guncel-link-ve-reklam-engelleyici/refs/heads/main/links/dizipal3.json";
  const apiUrl4 = "https://raw.githubusercontent.com/nzmcno/dizipal-guncel-link-ve-reklam-engelleyici/refs/heads/main/links/dizipal4.json";
  const apiUrl5 = "https://raw.githubusercontent.com/nzmcno/dizipal-guncel-link-ve-reklam-engelleyici/refs/heads/main/links/dizipal5.json";
  const fixedUrl = "https://dizipal1225.com";

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

  // API'den URL çeken fonksiyon (parametre olarak API URL alır)
  async function openDizipalFromAPI(apiUrl) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      const currentSiteURL = data.currentSiteURL || fixedUrl;
      chrome.tabs.create({ url: currentSiteURL });
    } catch (error) {
      console.error("API hatası:", error);
      alert("Site URL alınırken bir hata oluştu! Sabit URL'ye yönlendiriliyor.");
      chrome.tabs.create({ url: fixedUrl });
    }
  }

  // Dizipal 1 - API'den URL çek
  openDizipal1Button.addEventListener("click", () => openDizipalFromAPI(apiUrl1));

  // Dizipal 2 - Direkt link
  openDizipal2Button.addEventListener("click", () => {
    chrome.tabs.create({ url: "https://t.ly/dizipalguncel" });
  });

  // Dizipal 3 - API'den URL çek
  openDizipal3Button.addEventListener("click", () => openDizipalFromAPI(apiUrl3));

  // Dizipal 4 - API'den URL çek
  openDizipal4Button.addEventListener("click", () => openDizipalFromAPI(apiUrl4));

  // Dizipal 5 - API'den URL çek
  openDizipal5Button.addEventListener("click", () => openDizipalFromAPI(apiUrl5));

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
