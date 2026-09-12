import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import { deleteAdmin, getAdmins } from "../../redux/slices/admin"; // Ensure these actions are correct
import AddAdmin from "../../components/admin/Admin/AddAdmin";
import EditAdmin from "../../components/admin/Admin/EditAdmin";
import Modal from "../../components/admin/Modal";

const AdminPage = () => {
  const { admins } = useSelector((state) => state.admin); // Ensure `state.admin` is correct
  const dispatch = useDispatch();

  // Fetch admins on component mount
  useEffect(() => {
    dispatch(getAdmins()); // Check if this dispatch is correctly fetching data
  }, [dispatch]);

  // State for managing forms
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedAdmin, setEditedAdmin] = useState(null);

  // Form control functions
  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (admin) => {
    setEditedAdmin(admin);
    setEditForm(true);
  };

  const hideEditForm = () => setEditForm(false);

  // Deletion handler with confirmation
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
      const action = await dispatch(deleteAdmin(id));
      if (deleteAdmin.rejected.match(action)) {
        Swal.fire("Not deleted", action.payload ?? action.error.message, "error");
      } else {
        Swal.fire("Deleted!", "The admin has been deleted.", "success");
      }
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">Access</p>
          <h1 className="page-title">Admins</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={showAddForm} className="btn-primary">
            <i className="ri-add-line text-sm" />
            Add admin
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
            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="table-empty">
                  No admins yet.
                </td>
              </tr>
            )}
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td className="font-medium">
                  {admin.firstName} {admin.lastName}
                </td>
                <td className="text-stone">{admin.username}</td>
                <td className="text-stone">{admin.email}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="btn-icon"
                      title="Edit"
                      aria-label="Edit admin"
                      onClick={() => showEditForm(admin)}
                    >
                      <i className="ri-edit-box-line" />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title="Delete"
                      aria-label="Delete admin"
                      onClick={() => handleDelete(admin._id)}
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

      {addForm && (
        <Modal onClose={hideAddForm} label="Add admin">
          <AddAdmin onCancel={hideAddForm} />
        </Modal>
      )}

      {editForm && (
        <Modal onClose={hideEditForm} label="Edit admin">
          <EditAdmin admin={editedAdmin} onCancel={hideEditForm} />
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;
