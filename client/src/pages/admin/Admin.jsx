import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAdmin, getAdmins } from "../../redux/features/admin";
import AddAdmin from "../../components/admin/Admin/AddAdmin";
import EditAdmin from "../../components/admin/Admin/EditAdmin";

const AdminPage = () => {
  const { admins } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  // State for pagination
  const [limit, setLimit] = useState(5); // Limit of items per page
  const [currPage, setCurrPage] = useState(0); // Current page

  // Derived data for pagination
  const totalPages = Math.ceil(admins.length / limit); // Total number of pages
  const paginatedAdmins = admins.slice(
    currPage * limit,
    (currPage + 1) * limit
  ); // Data for the current page

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

  // Deletion handler
  const handleDelete = (id) => {
    dispatch(deleteAdmin(id));
  };

  // Fetch admins on component load and re-fetch when editedAdmin changes
  useEffect(() => {
    dispatch(getAdmins());
  }, [dispatch]);

  useEffect(() => {
    if (editedAdmin) {
      dispatch(getAdmins()); // Refresh the list after editing
    }
  }, [editedAdmin, dispatch]);

  // Page selection handler
  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Admins
          </h2>
          <button
            onClick={showAddForm}
            className="bg-primary py-2 px-6 text-white"
          >
            Add Admin
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
                  Username
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdmins.map((admin, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {admin.firstName} {admin.lastName}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {admin.username}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {admin.email}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center text-lg gap-2.5">
                      <button onClick={() => showEditForm(admin)}>
                        <i className="ri-edit-box-line hover:text-primary"></i>
                      </button>
                      <button onClick={() => handleDelete(admin._id)}>
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
          <AddAdmin onCancel={hideAddForm} />
        </div>
      )}

      {editForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          <EditAdmin admin={editedAdmin} onCancel={hideEditForm} />
        </div>
      )}
    </div>
  );
};

export default AdminPage;
