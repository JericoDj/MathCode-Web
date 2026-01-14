import "./LoadingSpinner.css";

export default function LoadingSpinner({ text = "Sending..." }) {
  return (
    <div className="loading-wrapper">
      <div className="loading-spinner"></div>
      <span className="loading-text">{text}</span>
    </div>
  );
}
