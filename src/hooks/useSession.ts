import { useContext } from "react";

import { UserContext } from "../context/user";
import { LanguageContext } from "../context/language";

export const useSession = () => {
  const ctx = useContext(UserContext);

  if (!ctx) throw Error("Something went wrong");

  return ctx;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);

  if (!ctx) throw Error("Something went wrong in language context");

  return ctx;
};
