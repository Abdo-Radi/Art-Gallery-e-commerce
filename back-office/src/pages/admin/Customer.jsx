import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import { deleteCustomer, getCustomers } from "../../redux/slices/customer";
import AddCustomer from "../../components/admin/Customer/AddCustomer";
import EditCustomer from "../../components/admin/Customer/EditCustomer";
import Modal from "../../components/admin/Modal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounced } from "../../hooks/useDebounced";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, pages, reset } = useSelector((state) => state.customers);

  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? 1)
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  // Fetch only once typing settles, not on every keystroke.
  const debouncedSearch = useDebounced(search);

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (customer) => {
    setEditedCustomer(customer);
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
      const action = await dispatch(deleteCustomer(id));
      if (deleteCustomer.rejected.match(action)) {
        Swal.fire("Not deleted", action.payload ?? action.error.message, "error");
      } else {
        Swal.fire("Deleted!", "The customer has been deleted.", "success");
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
    dispatch(getCustomers({ page: currentPage, search: debouncedSearch }));

    const queryParams = new URLSearchParams();
    if (debouncedSearch !== "") {
      queryParams.set("search", debouncedSearch);
    }

    queryParams.set("page", currentPage);

    const newUrl = `/admin/customers?${queryParams.toString()}`;
    navigate(newUrl, { replace: true });
  }, [dispatch, currentPage, debouncedSearch, reset]);

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">People</p>
          <h1 className="page-title">Customers</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search customers…"
            value={search}
            onChange={handleSearchChange}
            className="input-field w-64"
          />
          <button onClick={showAddForm} className="btn-primary">
            <i className="ri-add-line text-sm" />
            Add customer
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
                  No customers yet.
                </td>
              </tr>
            )}
            {list.map((customer) => (
              <tr key={customer._id}>
                <td className="font-medium">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="text-stone">{customer.username}</td>
                <td className="text-stone">{customer.email}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="btn-icon"
                      title="Edit"
                      aria-label="Edit customer"
                      onClick={() => showEditForm(customer)}
                    >
                      <i className="ri-edit-box-line" />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title="Delete"
                      aria-label="Delete customer"
                      onClick={() => handleDelete(customer._id)}
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
            disabled={currentPage === 1}
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
                currentPage === i + 1 ? "page-btn-active" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === pages}
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
        <Modal onClose={hideAddForm} label="Add customer">
          <AddCustomer onCancel={hideAddForm} />
        </Modal>
      )}

      {editForm && (
        <Modal onClose={hideEditForm} label="Edit customer">
          <EditCustomer customer={editedCustomer} onCancel={hideEditForm} />
        </Modal>
      )}
    </div>
  );
};

export default CustomerPage;
