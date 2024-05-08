import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getCategories,
  editCategory,
} from "../../redux/features/category";
import AddCategory from "../../components/admin/Category/AddCategory";
import EditCategory from "../../components/admin/Category/EditCategory";

const Category = () => {
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  // Pagination state
  const [limit, setLimit] = useState(5); // Items per page
  const [currPage, setCurrPage] = useState(0); // Current page
  const totalPages = Math.ceil(categories.length / limit); // Total number of pages
  const paginatedCategories = categories.slice(
    currPage * limit,
    (currPage + 1) * limit
  );

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
    dispatch(deleteCategory(id));
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleEdit = async (category) => {
    const { _id, ...rest } = category;
    dispatch(editCategory({ id: _id, body: rest }));
    setEditForm(false); // Close edit form after submitting
  };

  // Handler for changing pages
  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Categories
          </h2>
          <button
            onClick={showAddForm}
            className="bg-primary py-2 px-6 text-white"
          >
            Add Category
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="p-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {category.name}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {category.description}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center text-lg gap-2.5">
                      <button onClick={() => showEditForm(category)}>
                        <i className="ri-edit-box-line hover:text-primary"></i>
                      </button>
                      <button onClick={() => handleDelete(category._id)}>
                        <i className="ri-delete-bin-6-line hover=text-primary"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center space-x-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-1 ${
                  currPage === i ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {addForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          <AddCategory onCancel={hideAddForm} />
        </div>
      )}

      {editForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          <EditCategory
            category={editedCategory}
            onEdit={handleEdit}
            onCancel={hideEditForm}
          />
        </div>
      )}
    </div>
  );
};

export default Category;
