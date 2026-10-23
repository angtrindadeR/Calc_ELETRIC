import { useEffect } from "react";
import { Platform } from "react-native";
export function useOfflineWeb() {
  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      __DEV__ ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator)
    )
      return;
    // O app continua utilizável se o navegador não permitir cache offline.
    void navigator.serviceWorker.register("./sw.js").catch(() => {
      console.warn(
        "O cache offline web não pôde ser ativado. Os cadastros locais continuam preservados.",
      );
    });
  }, []);
}
