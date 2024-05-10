import React from "react";

const ArtworkViewPopup = ({ artwork, onClose }) => {
  if (!artwork) {
    return null; // Don't render if no artwork is selected
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white w-96 p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <i className="ri-close-circle-line"></i> {/* Close Button */}
        </button>

        <h3 className="font-medium text-black">{artwork.title}</h3>

        <div className="mt-4">
          <img
            src={artwork.image}
            alt={artwork.title}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <p>
          <strong>Artist:</strong> {artwork.artist?.firstName}{" "}
          {artwork.artist?.lastName}
        </p>

        <p>
          <strong>Category:</strong> {artwork.category?.name}
        </p>

        <p>
          <strong>Price:</strong> ${artwork.price}
        </p>

        <p>
          <strong>Description:</strong> {artwork.description}
        </p>
      </div>
    </div>
  );
};

export default ArtworkViewPopup;
