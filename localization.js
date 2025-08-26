async function initLocalization() {
    const supportedLangs = ['en', 'ru'];
    const defaultLang = 'en';
    let lang = navigator.language.split('-')[0];
    if (!supportedLangs.includes(lang)) {
        lang = defaultLang;
    }

    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            console.error(`Could not load ${lang}.json, falling back to default.`);
            const fallbackResponse = await fetch(`locales/${defaultLang}.json`);
            window.i18nData = await fallbackResponse.json();
            lang = defaultLang;
        } else {
            window.i18nData = await response.json();
        }

        document.documentElement.lang = lang;
        document.title = window.i18nData.title;

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (window.i18nData[key]) {
                element.textContent = window.i18nData[key];
            }
        });
    } catch (error) {
        console.error("Localization failed:", error);
        // The page will just display the default Russian text if something goes wrong,
        // which is better than a blank page.
    }
}

// Since this script is loaded with 'defer', the DOM will be ready when it executes.
// So we can call the function directly.
initLocalization();
