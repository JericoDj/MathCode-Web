export default class Colors {
  // Primary palette
  static primary = "#4fc3f7";      // Light blue
  static primaryDark = "#0288d1";  // Darker blue
  static primaryLight = "#b3e5fc"; // Lighter blue

  // Secondary palette
  static secondary = "#ffb74d";     // Orange
  static secondaryDark = "#f57c00";
  static secondaryLight = "#ffe0b2";

  // Neutral / gray
  static white = "#ffffff";
  static black = "#000000";
  static gray100 = "#f5f5f5";
  static gray200 = "#eeeeee";
  static gray300 = "#e0e0e0";
  static gray400 = "#bdbdbd";
  static gray500 = "#9e9e9e";
  static gray600 = "#757575";
  static gray700 = "#616161";
  static gray800 = "#424242";
  static gray900 = "#212121";

  // Status colors
  static success = "#66bb6a"; // green
  static error = "#ef5350";   // red
  static warning = "#ffa726"; // orange
  static info = "#29b6f6";    // blue
}

/* ------------------------------
  SAMPLE USAGE
------------------------------ */

// import Colors from '../utils/colors.jsx';

// Inline style example:
const navbarStyle = {
  backgroundColor: Colors.primary,
  color: Colors.white,
  padding: "1rem",
};

// JSX example:
function SampleNavbar() {
  return (
    <nav style={navbarStyle}>
      <h1>MathCode</h1>
    </nav>
  );
}

// console.log example:
console.log("Primary color is:", Colors.primary);
