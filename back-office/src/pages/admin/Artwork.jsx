import { useDispatch, useSelector } from "react-redux";
import { deleteArtwork, getArtworks } from "../../redux/slices/artwork";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AddArtwork from "../../components/admin/Artwork/AddArtwork";
import EditArtwork from "../../components/admin/Artwork/EditArtwork";
import ArtworkViewPopup from "../../components/admin/Artwork/ArtworkView";
import Modal from "../../components/admin/Modal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounced } from "../../hooks/useDebounced";

const Artwork = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, pages, reset } = useSelector((state) => state.artworks);

  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isViewPopupVisible, setIsViewPopupVisible] = useState(false);

  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? 1)
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  // Fetch only once typing settles, not on every keystroke.
  const debouncedSearch = useDebounced(search);

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedArtwork, setEditedArtwork] = useState(null);

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (artwork) => {
    setEditedArtwork(artwork);
    setEditForm(true);
  };

  const hideEditForm = () => setEditForm(false);

  const showViewPopup = (artwork) => {
    setSelectedArtwork(artwork);
    setIsViewPopupVisible(true);
  };

  const hideViewPopup = () => {
    setSelectedArtwork(null);
    setIsViewPopupVisible(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      const action = await dispatch(deleteArtwork(id));
      if (deleteArtwork.rejected.match(action)) {
        Swal.fire("Not deleted", action.payload ?? action.error.message, "error");
      } else {
        Swal.fire("Deleted!", "Artwork has been deleted.", "success");
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(getArtworks({ page: currentPage, search: debouncedSearch }));

    const queryParams = new URLSearchParams();
    if (debouncedSearch !== "") {
      queryParams.set("search", debouncedSearch);
    }

    queryParams.set("page", currentPage);

    const newUrl = `/admin/artworks?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
  }, [dispatch, currentPage, debouncedSearch, reset]);

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">Catalogue</p>
          <h1 className="page-title">Artworks</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search artworks…"
            value={search}
            onChange={handleSearchChange}
            className="input-field w-64"
          />
          <button onClick={showAddForm} className="btn-primary">
            <i className="ri-add-line text-sm" />
            Add artwork
          </button>
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Category</th>
              <th className="text-right">Price</th>
              <th className="w-px text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="table-empty">
                  No artworks yet.
                </td>
              </tr>
            )}
            {list.map((artwork) => (
              <tr key={artwork._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 border border-line bg-surface">
                      <img
                        className="h-full w-full object-cover"
                        src={artwork.image}
                        alt="Artwork"
                      />
                    </div>
                    <p className="font-medium">{artwork.title}</p>
                  </div>
                </td>
                <td>
                  {artwork.artist ? (
                    <>
                      {artwork.artist?.firstName} {artwork.artist?.lastName}
                    </>
                  ) : (
                    <span className="text-stone-light">—</span>
                  )}
                </td>
                <td className="text-stone">
                  {artwork.category?.name || (
                    <span className="text-stone-light">—</span>
                  )}
                </td>
                <td className="text-right tabular-nums">{artwork.price} DH</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="btn-icon"
                      title="View"
                      aria-label="View artwork"
                      onClick={() => showViewPopup(artwork)}
                    >
                      <i className="ri-eye-line" />
                    </button>
                    <button
                      className="btn-icon"
                      title="Edit"
                      aria-label="Edit artwork"
                      onClick={() => showEditForm(artwork)}
                    >
                      <i className="ri-edit-box-line" />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title="Delete"
                      aria-label="Delete artwork"
                      onClick={() => handleDelete(artwork._id)}
                    >
                      <i className="ri-delete-bin-6-line" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            disabled={currentPage == 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
            }}
            className="page-btn"
            aria-label="Previous page"
          >
            <i className="ri-arrow-left-s-line" />
          </button>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`page-btn ${
                currentPage == i + 1 ? "page-btn-active" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage == pages}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
            }}
            className="page-btn"
            aria-label="Next page"
          >
            <i className="ri-arrow-right-s-line" />
          </button>
        </div>
      )}

      {addForm && (
        <Modal onClose={hideAddForm} label="Add artwork">
          <AddArtwork onCancel={hideAddForm} />
        </Modal>
      )}

      {editForm && (
        <Modal onClose={hideEditForm} label="Edit artwork">
          <EditArtwork artwork={editedArtwork} onCancel={hideEditForm} />
        </Modal>
      )}

      {isViewPopupVisible && (
        <Modal onClose={hideViewPopup} label="Artwork details">
          <ArtworkViewPopup artwork={selectedArtwork} onClose={hideViewPopup} />
        </Modal>
      )}
    </div>
  );
};

export default Artwork;
