"use client";
import { Children, Fragment, useContext, type ReactNode } from "react";
import { LanguageContext } from "@/lib/i18n/context";
import { translateText } from "@/lib/i18n/translate";
export function useTranslate() {
  const language = useContext(LanguageContext);
  function t(text: string): string;
  function t(text: undefined): undefined;
  function t(text: string | undefined): string | undefined;
  function t(text: string | undefined) {
    return typeof text === "string" ? translateText(text, language) : text;
  }
  return t;
}
export function Localize({ children }: { children: ReactNode }) {
  const t = useTranslate();
  return (
    <Fragment>
      {Children.map(children, (child) =>
        typeof child === "string" ? t(child) : child,
      )}
    </Fragment>
  );
}
