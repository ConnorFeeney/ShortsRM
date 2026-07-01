import { useState, useEffect } from "react";

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

export function useChromeStorage<T>(key: string, init: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(init);

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get([key], (result: Record<string, T>) => {
        if (result[key] !== undefined) {
          setStoredValue(result[key]);
        }
      });
    }
  }, [key]);

  const setValue: SetValue<T> = (value) => {
    try {
      const valueToStore =
        value instanceof Function
          ? (value as (prev: T) => T)(storedValue)
          : value;

      setStoredValue(valueToStore);

      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ [key]: valueToStore });
      }
    } catch (error) {
      console.error("Error setting chrome storage:", error);
    }
  };

  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local" && changes[key]) {
        setStoredValue(changes[key].newValue as T);
      }
    };

    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);

      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, [key]);

  return [storedValue, setValue];
}