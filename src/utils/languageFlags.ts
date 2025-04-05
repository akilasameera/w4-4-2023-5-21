// Map of languages to their corresponding country flag emoji codes
const languageFlags: Record<string, string> = {
  English: "🇬🇧",
  Spanish: "🇪🇸",
  French: "🇫🇷",
  German: "🇩🇪",
  Italian: "🇮🇹",
  Portuguese: "🇵🇹",
  Russian: "🇷🇺",
  Japanese: "🇯🇵",
  Korean: "🇰🇷",
  Chinese: "🇨🇳",
  Arabic: "🇸🇦",
  Hindi: "🇮🇳",
  Bengali: "🇧🇩",
  Dutch: "🇳🇱",
  Swedish: "🇸🇪",
  Norwegian: "🇳🇴",
  Danish: "🇩🇰",
  Finnish: "🇫🇮",
  Greek: "🇬🇷",
  Turkish: "🇹🇷",
  Polish: "🇵🇱",
  Ukrainian: "🇺🇦",
  Czech: "🇨🇿",
  Hungarian: "🇭🇺",
  Romanian: "🇷🇴",
  Thai: "🇹🇭",
  Vietnamese: "🇻🇳",
  Indonesian: "🇮🇩",
  Malay: "🇲🇾",
  Tagalog: "🇵🇭",
  Swahili: "🇰🇪",
  Afrikaans: "🇿🇦",
};

export const getLanguageFlag = (language: string): string => {
  return languageFlags[language] || "🌐";
};

export default languageFlags;
