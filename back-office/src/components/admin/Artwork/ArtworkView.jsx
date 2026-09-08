const ArtworkViewPopup = ({ artwork, onClose }) => {
  return (
    <div className="modal-card-wide">
      <div className="modal-head">
        <div>
          <p className="admin-eyebrow">Catalogue</p>
          <h3 className="modal-title">{artwork.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn-icon"
          title="Close"
          aria-label="Close"
        >
          <i className="ri-close-line text-xl" />
        </button>
      </div>

      <div className="modal-body">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-64 w-full border border-line bg-surface">
            <img
              className="h-full w-full object-cover"
              src={artwork.image}
              alt={artwork.title}
            />
          </div>

          <dl className="space-y-4">
            <div>
              <dt className="label-cap">Title</dt>
              <dd className="mt-1.5 text-ink">{artwork.title}</dd>
            </div>
            <div>
              <dt className="label-cap">Artist</dt>
              <dd className="mt-1.5 text-ink">
                {artwork.artist ? (
                  <>
                    {artwork.artist?.firstName} {artwork.artist?.lastName}
                  </>
                ) : (
                  <span className="text-stone-light">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="label-cap">Category</dt>
              <dd className="mt-1.5 text-ink">
                {artwork.category?.name || (
                  <span className="text-stone-light">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="label-cap">Price</dt>
              <dd className="mt-1.5 tabular-nums text-ink">
                {artwork.price} DH
              </dd>
            </div>
            <div>
              <dt className="label-cap">Status</dt>
              <dd className="mt-1.5">
                {artwork.status ? (
                  <span
                    className={`chip ${
                      artwork.status === "sold" ? "chip-neutral" : "chip-success"
                    }`}
                  >
                    {artwork.status}
                  </span>
                ) : (
                  <span className="text-stone-light">—</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <p className="label-cap mb-2">Description</p>
          <p className="text-sm leading-relaxed text-stone">
            {artwork.description || (
              <span className="text-stone-light">No description recorded.</span>
            )}
          </p>
        </div>
      </div>

      <div className="modal-foot">
        <button type="button" onClick={onClose} className="btn-outline ml-auto">
          Close
        </button>
      </div>
    </div>
  );
};

export default ArtworkViewPopup;
