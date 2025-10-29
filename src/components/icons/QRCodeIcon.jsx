import React from "react";

const SVG_PATHS = {
  QR_CODE: {
    RECTANGLES: [
      "M3 3h5v5H3z",
      "M16 3h5v5h-5z",
      "M3 16h5v5H3z"
    ],
    PATHS: [
      "M21 16h-3a2 2 0 0 0-2 2v3",
      "M21 21v.01",
      "M12 7v3a2 2 0 0 1-2 2H7",
      "M3 12h.01",
      "M12 3h.01",
      "M12 16v.01",
      "M16 12h1",
      "M21 12v.01",
      "M12 21v-1"
    ]
  }
};

export const QRCodeIcon = ({ size = 20, color = "white" }) => {
  const { RECTANGLES, PATHS } = SVG_PATHS.QR_CODE;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Render rectangles */}
      {RECTANGLES.map((d, i) => (
        <path key={`rect-${i}`} d={d} fill={color} />
      ))}

      {/* Render other paths */}
      {PATHS.map((d, i) => (
        <path key={`path-${i}`} d={d} stroke={color} fill="none" />
      ))}
    </svg>
  );
};
