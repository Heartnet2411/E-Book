const vi = {
    en: "Tiếng Anh",
    vi: "Tiếng Việt",
    fr: "Tiếng Pháp"
}
export function getLanguageName(code) {
    return vi[code] || "Chưa xác định";
}