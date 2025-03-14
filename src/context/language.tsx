import { createContext, useState, type ReactNode } from "react";
import i18n from "../i18n";

type LanguageContextProps = {
  language: 0 | 1;
  onChangeLanguage: (value: 0 | 1) => void;
};

export const LanguageContext = createContext<LanguageContextProps | null>(null);

export const LanguageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [language, setLanguage] = useState<0 | 1>(0);

  const onChangeLanguage = (value: 0 | 1) => {
    setLanguage(value);
    i18n.changeLanguage(value === 0 ? "en" : "ar");
  };

  return (
    <LanguageContext.Provider value={{ language, onChangeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
