import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteArtist, getArtists } from "../../redux/slices/artist";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounced } from "../../hooks/useDebounced";
import AddArtist from "../../components/admin/Artist/AddArtist";
import EditArtist from "../../components/admin/Artist/EditArtist";
import Swal from "sweetalert2";

const Artist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, pages, reset } = useSelector((state) => state.artists);

  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? 1)
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  // Fetch only once typing settles, not on every keystroke.
  const debouncedSearch = useDebounced(search);

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedArtist, setEditedArtist] = useState(null);

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (artist) => {
    setEditedArtist(artist);
    setEditForm(true);
  };

  const hideEditForm = () => setEditForm(false);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      dispatch(deleteArtist(id));
      Swal.fire("Deleted!", "The artist has been deleted.", "success");
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
    dispatch(getArtists({ page: currentPage, search: debouncedSearch }));

    const queryParams = new URLSearchParams();
    if (debouncedSearch !== "") {
      queryParams.set("search", debouncedSearch);
    }

    queryParams.set("page", currentPage);

    const newUrl = `/admin/artists?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
  }, [dispatch, currentPage, debouncedSearch, reset]);

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">People</p>
          <h1 className="page-title">Artists</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search artists…"
            value={search}
            onChange={handleSearchChange}
            className="input-field w-64"
          />
          <button onClick={showAddForm} className="btn-primary">
            <i className="ri-add-line text-sm" />
            Add artist
          </button>
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th className="w-px text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="table-empty">
                  No artists yet.
                </td>
              </tr>
            )}
            {list.map((artist) => (
              <tr key={artist._id}>
                <td className="font-medium">
                  {artist.firstName} {artist.lastName}
                </td>
                <td className="text-stone">{artist.username}</td>
                <td className="text-stone">{artist.email}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="btn-icon"
                      title="Edit artist"
                      aria-label="Edit artist"
                      onClick={() => showEditForm(artist)}
                    >
                      <i className="ri-edit-box-line" />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title="Delete artist"
                      aria-label="Delete artist"
                      onClick={() => handleDelete(artist._id)}
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
        <div className="modal-scrim">
          <AddArtist onCancel={hideAddForm} resetPage={() => setCurrentPage(1)} />
        </div>
      )}

      {editForm && (
        <div className="modal-scrim">
          <EditArtist
            artist={editedArtist}
            onCancel={hideEditForm}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Artist;
