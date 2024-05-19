import React from "react";

const ArtworkViewPopup = ({ artwork, onClose }) => {
  return (
    <div className="overflow-y-auto h-5/6 no-scrollbar mx-4 w-96 md:mx-0 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="sticky top-0 bg-white flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark z-9999">
        <h3 className="font-medium text-black dark:text-white">
          {artwork.title}
        </h3>
        <button onClick={onClose}>
          <i className="ri-close-circle-line text-lg"></i>
        </button>
      </div>
      <div className="p-6.5">
        <img
          className="border border-stroke mb-3"
          src={artwork.image}
          alt="Artwork"
        />
        <p>
          <span className="font-bold">Title:</span> {artwork.title}
        </p>
        <p>
          <span className="font-bold">Price:</span> {artwork.price} DH
        </p>
        <p>
          <span className="font-bold">Category:</span> {artwork.category.name}
        </p>
        <p>
          <span className="font-bold">Artist:</span> {artwork.artist.firstName}{" "}
          {artwork.artist.lastName}
        </p>
        <p>
          <span className="font-bold">Description:</span> {artwork.description}{" "}
        </p>
      </div>
    </div>
  );
};

export default ArtworkViewPopup;
