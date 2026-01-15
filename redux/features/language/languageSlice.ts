import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LanguageState {
    language: "en" | "de";
}

const getInitialLanguage = (): "en" | "de" => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("language");
        if (saved === "en" || saved === "de") return saved as "en" | "de";
    }
    return "en";
};

const initialState: LanguageState = {
    language: getInitialLanguage(),
};

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<"en" | "de">) => {
            state.language = action.payload;
            if (typeof window !== "undefined") {
                localStorage.setItem("language", action.payload);
            }
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
