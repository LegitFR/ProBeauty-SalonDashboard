"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type TranslateWindow = Window & {
  googleTranslateElementInit?: () => void;
  setGoogleTranslateLanguage?: (lang: string) => void;
  google?: {
    translate?: {
      TranslateElement?: new (
        options: {
          pageLanguage: string;
          includedLanguages: string;
          autoDisplay: boolean;
        },
        elementId: string,
      ) => void;
    };
  };
};

const STORAGE_KEY = "pb_lang";
const DEFAULT_LANG = "en";
const SUPPORTED_LANGS = ["en", "fr", "de", "es", "pt"];
const GOOGLE_ELEMENT_ID = "google_translate_element";
const SCRIPT_ID = "google-translate-script";
const INIT_ATTR = "data-gt-initialized";

function setTranslateCookie(lang: string) {
  const normalized = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  document.cookie = `googtrans=/en/${normalized}; path=/`;
}

function ensureTranslateContainer() {
  let container = document.getElementById(GOOGLE_ELEMENT_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = GOOGLE_ELEMENT_ID;
    container.style.display = "none";
    document.body.appendChild(container);
  }
  return container;
}

function applyLanguage(lang: string) {
  const normalized = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  setTranslateCookie(normalized);
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select || select.value === normalized) {
    return;
  }
  select.value = normalized;
  select.dispatchEvent(new Event("change"));
}

export function GoogleTranslateLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const storedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    setTranslateCookie(storedLang);

    const translateWindow = window as TranslateWindow;
    translateWindow.googleTranslateElementInit = () => {
      if (!translateWindow.google?.translate?.TranslateElement) {
        return;
      }

      const container = ensureTranslateContainer();
      if (container.getAttribute(INIT_ATTR) !== "true") {
        new translateWindow.google.translate.TranslateElement(
          {
            pageLanguage: DEFAULT_LANG,
            includedLanguages: SUPPORTED_LANGS.join(","),
            autoDisplay: false,
          },
          GOOGLE_ELEMENT_ID,
        );
        container.setAttribute(INIT_ATTR, "true");
      }

      applyLanguage(storedLang);
    };

    translateWindow.setGoogleTranslateLanguage = (lang: string) => {
      const nextLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
      localStorage.setItem(STORAGE_KEY, nextLang);
      applyLanguage(nextLang);
    };

    ensureTranslateContainer();

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    } else if (translateWindow.google?.translate?.TranslateElement) {
      translateWindow.googleTranslateElementInit();
    }

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      const nextLang =
        detail || localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
      applyLanguage(nextLang);
    };

    window.addEventListener("pb_lang_change", handler);
    return () => window.removeEventListener("pb_lang_change", handler);
  }, []);

  useEffect(() => {
    const storedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    if (!storedLang) {
      return;
    }
    const timer = window.setTimeout(() => {
      applyLanguage(storedLang);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
