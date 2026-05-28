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

function getStoredLang() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
}

export function GoogleTranslateLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const patchKey = "__pb_safe_remove_child__";
    const win = window as Window & {
      [patchKey]?: boolean;
    };
    if (!win[patchKey]) {
      const originalRemoveChild = Node.prototype.removeChild;
      (Node.prototype as { removeChild: (child: Node) => Node }).removeChild =
        function removeChildSafe(child: Node) {
          try {
            return originalRemoveChild.call(this, child);
          } catch (error) {
            if (error instanceof DOMException && error.name === "NotFoundError") {
              return child;
            }
            throw error;
          }
        };
      win[patchKey] = true;
    }

    const storedLang = getStoredLang();
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

    let toastObserver: MutationObserver | null = null;
    let bodyObserver: MutationObserver | null = null;
    let reapplyTimer: number | null = null;

    const requestTranslateReapply = () => {
      const lang = getStoredLang();
      if (!lang || lang === DEFAULT_LANG) {
        return;
      }
      if (reapplyTimer) {
        window.clearTimeout(reapplyTimer);
      }
      reapplyTimer = window.setTimeout(() => {
        applyLanguage(lang);
      }, 120);
    };

    const attachToastObserver = () => {
      const container = document.querySelector<HTMLElement>(".toaster");
      if (!container || container.getAttribute("data-gt-observe") === "true") {
        return;
      }

      container.setAttribute("data-gt-observe", "true");
      toastObserver?.disconnect();
      toastObserver = new MutationObserver(() => {
        requestTranslateReapply();
      });
      toastObserver.observe(container, { childList: true, subtree: true });
    };

    attachToastObserver();
    const popupSelector =
      "[data-slot='dialog-content'], [data-slot='sheet-content'], [data-slot='drawer-content'], [data-slot='alert-dialog-content']";

    const hasPopupNode = (node: Node) => {
      if (!(node instanceof HTMLElement)) {
        return false;
      }
      return node.matches(popupSelector) || !!node.querySelector(popupSelector);
    };

    bodyObserver = new MutationObserver((mutations) => {
      let shouldReapply = false;
      for (const mutation of mutations) {
        if (!mutation.addedNodes.length) {
          continue;
        }
        mutation.addedNodes.forEach((node) => {
          if (hasPopupNode(node)) {
            shouldReapply = true;
          }
        });
        if (shouldReapply) {
          break;
        }
      }
      if (shouldReapply) {
        requestTranslateReapply();
      }
      attachToastObserver();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      const nextLang = detail || getStoredLang();
      applyLanguage(nextLang);
    };

    window.addEventListener("pb_lang_change", handler);
    return () => {
      window.removeEventListener("pb_lang_change", handler);
      toastObserver?.disconnect();
      bodyObserver?.disconnect();
      if (reapplyTimer) {
        window.clearTimeout(reapplyTimer);
      }
    };
  }, []);

  useEffect(() => {
    const storedLang = getStoredLang();
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
