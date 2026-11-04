"use client";
import { createContext } from "react";
import type { Language } from "./translate";
export const LanguageContext = createContext<Language>("en");
