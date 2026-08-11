import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounced } from "../../hooks/useDebounced";
import AddExhibition from "../../components/admin/Exhibition/AddExhibition";
import EditExhibition from "../../components/admin/Exhibition/EditExhibition";
import Swal from "sweetalert2";
import {
  getExhibitions,
  deleteExhibition,
} from "../../redux/slices/exhibition";

const Exhibition = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, pages, reset } = useSelector((state) => state.exhibitions);

  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? 1)
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  // Fetch only once typing settles, not on every keystroke.
  const debouncedSearch = useDebounced(search);

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedExhibition, setEditedExhibition] = useState(null);

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (exhibition) => {
    setEditedExhibition(exhibition);
    setEditForm(true);
  };

  const hideEditForm = () => setEditForm(false);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      dispatch(deleteExhibition(id));
      Swal.fire("Deleted!", "The exhibition has been deleted.", "success");
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
    dispatch(getExhibitions({ page: currentPage, search: debouncedSearch }));

    const queryParams = new URLSearchParams();
    if (debouncedSearch !== "") {
      queryParams.set("search", debouncedSearch);
    }

    queryParams.set("page", currentPage);

    const newUrl = `/admin/exhibitions?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
  }, [dispatch, currentPage, debouncedSearch, reset]);

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">Programme</p>
          <h1 className="page-title">Exhibitions</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search exhibitions…"
            value={search}
            onChange={handleSearchChange}
            className="input-field w-64"
          />
          <button onClick={showAddForm} className="btn-primary">
            <i className="ri-add-line text-sm" />
            Add exhibition
          </button>
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Exhibition</th>
              <th className="text-right">Quantity</th>
              <th className="text-right">Price</th>
              <th>Date</th>
              <th className="w-px text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="table-empty">
                  No exhibitions yet.
                </td>
              </tr>
            )}
            {list.map((exhibition) => (
              <tr key={exhibition._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 border border-line bg-surface">
                      <img
                        src={
                          exhibition.image || "https://via.placeholder.com/150"
                        }
                        alt={exhibition.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{exhibition.name}</span>
                  </div>
                </td>
                <td className="text-right tabular-nums">
                  {exhibition.quantity}
                </td>
                <td className="text-right tabular-nums">
                  {exhibition.price} DH
                </td>
                <td className="text-stone">
                  {new Date(exhibition.date).toDateString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="btn-icon"
                      title="Edit"
                      aria-label="Edit exhibition"
                      onClick={() => showEditForm(exhibition)}
                    >
                      <i className="ri-edit-box-line" />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title="Delete"
                      aria-label="Delete exhibition"
                      onClick={() => handleDelete(exhibition._id)}
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
          <AddExhibition onCancel={hideAddForm} />
        </div>
      )}

      {editForm && (
        <div className="modal-scrim">
          <EditExhibition
            exhibition={editedExhibition}
            onCancel={hideEditForm}
          />
        </div>
      )}
    </div>
  );
};

export default Exhibition;
