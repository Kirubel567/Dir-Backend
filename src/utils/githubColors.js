// imported from ozh/github-colors

export const LANGUAGE_COLORS = {
  "JavaScript": "#f1e05a",
  "TypeScript": "#3178c6",
  "Python": "#3572A5",
  "Java": "#b07219",
  "HTML": "#e34c26",
  "CSS": "#563d7c",
  "C++": "#f34b7d",
  "C#": "#178600",
  "C": "#555555",
  "PHP": "#4F5D95",
  "Ruby": "#701516",
  "Go": "#00ADD8",
  "Rust": "#dea584",
  "Swift": "#F05138",
  "Kotlin": "#A97BFF",
  "Dart": "#00B4AB",
  "Shell": "#89e051",
  "Vue": "#41b883",
  "React": "#61dafb",
  "Zig": "#ec915c",
  "Solidity": "#AA6746",
  "Svelte": "#ff3e00",
  "Dockerfile": "#384d54",
  "Markdown": "#083fa1",
  // Default fallback for unknown languages
  "Default": "#858585"
};


// Helper to get color with a fallback

export const getLanguageColor = (langName) => {
  return LANGUAGE_COLORS[langName] || LANGUAGE_COLORS.Default;
};