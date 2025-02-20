import { useContext } from "react";
import { LanguageContext } from "../context/language";

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);

  if (!ctx) throw Error("Something went wrong in language context");

  return ctx;
};
