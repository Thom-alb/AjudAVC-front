const palette = {
  navy: "#0E1F2C",
  blue: "#244E70",
  blueLight: "#6FA4E8",
  sky: "#73A5C6",
  white: "#FFFFFF",
  black: "#000000",
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate900: "#0F172A",
  danger: "#DC2626",
  success: "#15803D",
};

const tintColorLight = palette.blue;
const tintColorDark = palette.blueLight;

const Colors = {
  palette,
  light: {
    text: palette.slate900,
    background: palette.slate50,
    surface: palette.white,
    card: palette.white,
    border: palette.slate200,
    muted: palette.slate500,
    tint: tintColorLight,
    primary: palette.blue,
    secondary: palette.blueLight,
    tabBar: palette.white,
    tabIconDefault: "#8A9AB1",
    tabIconSelected: tintColorLight,
    input: palette.white,
    placeholder: palette.slate500,
    overlay: "rgba(0,0,0,0.5)",
  },
  dark: {
    text: "#F1F5F9",
    background: palette.navy,
    surface: "#162B3D",
    card: "#1B3448",
    border: "#35536B",
    muted: "#A0B5C6",
    tint: tintColorDark,
    primary: palette.blueLight,
    secondary: "#8DB9F0",
    tabBar: "#122635",
    tabIconDefault: "#91A4B5",
    tabIconSelected: tintColorDark,
    input: "#20394D",
    placeholder: "#A0B5C6",
    overlay: "rgba(0,0,0,0.68)",
  },
};

export default Colors;
