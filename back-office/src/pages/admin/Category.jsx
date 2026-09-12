import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { deleteCategory, getCategories } from "../../redux/slices/category";
import AddCategory from "../../components/admin/Category/AddCategory";
import EditCategory from "../../components/admin/Category/EditCategory";
import Modal from "../../components/admin/Modal";

const Category = () => {
  const { list, reset } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedCategory, setEditedCategory] = useState(null);

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (category) => {
    setEditedCategory(category);
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
      const action = await dispatch(deleteCategory(id));
      if (deleteCategory.rejected.match(action)) {
        Swal.fire("Not deleted", action.payload ?? action.error.message, "error");
      } else {
        Swal.fire("Deleted!", "The category has been deleted.", "success");
      }
    }
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch, reset]);

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">Taxonomy</p>
          <h1 className="page-title">Categories</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={showAddForm} className="btn-primary">
            <i className="ri-add-line text-sm" />
            Add category
          </button>
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className="w-px text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={3} className="table-empty">
                  No categories yet.
                </td>
              </tr>
            )}
            {list.map((category) => (
              <tr key={category._id}>
                <td className="font-medium">{category.name}</td>
                <td className="text-stone">{category.description}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="btn-icon"
                      title="Edit category"
                      aria-label="Edit category"
                      onClick={() => showEditForm(category)}
                    >
                      <i className="ri-edit-box-line" />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title="Delete category"
                      aria-label="Delete category"
                      onClick={() => handleDelete(category._id)}
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
        <Modal onClose={hideAddForm} label="Add category">
          <AddCategory onCancel={hideAddForm} />
        </Modal>
      )}

      {editForm && (
        <Modal onClose={hideEditForm} label="Edit category">
          <EditCategory category={editedCategory} onCancel={hideEditForm} />
        </Modal>
      )}
    </div>
  );
};

export default Category;
