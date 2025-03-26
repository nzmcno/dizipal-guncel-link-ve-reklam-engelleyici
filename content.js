(function () {
  'use strict';

  const allowedPatterns = [
    /^dizipal\d*\.com$/, 
    /^dizipal\d*\.net$/,
    /^dizipal\d*\.org$/,
    /^stream\.dizipal\d*\.com$/
  ];

  const currentDomain = window.location.hostname;

  if (!allowedPatterns.some((pattern) => pattern.test(currentDomain))) {
    return;
  }

  // Ayarları yükle
  chrome.storage.local.get(["maxTries", "adBlockDuration", "adBlockEnabled"], (settings) => {
    const maxTries = settings.maxTries ?? 6; // Varsayılan 6
    const maxDuration = (settings.adBlockDuration ?? 2) * 60000; // Varsayılan 2 dakika
    const isAdBlockEnabled = settings.adBlockEnabled ?? true; // Varsayılan açık
    const startTime = Date.now();

    let tryCount = 0;

    if (!isAdBlockEnabled) {
      return;
    }

    function skipAds() {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime > maxDuration || tryCount >= maxTries) {
        return;
      }

      removeElementsByClass("bb");

      const skipButtons = document.querySelectorAll("#skipButton");
      if (skipButtons.length > 0) {
        skipButtons.forEach((button) => {
          if (button && button.style.display !== "none") {
            try {
              button.removeAttribute("disabled");
              button.click();
              tryCount++;
            } catch (error) {
              console.error("Skip button işleminde hata:", error);
            }
          }
        });
      } else {
      }

      if (tryCount < maxTries) {
        setTimeout(skipAds, 100);
      }
    }

    function removeElementsByClass(className) {
      const elements = document.getElementsByClassName(className);
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    }
    // Reklam temizleme işlemini başlat
    skipAds();
  });
})();
