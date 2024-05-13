import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  getExhibitions,
  deleteExhibition,
} from "../../redux/slices/exhibition";
import AddExhibition from "../../components/admin/Exhibition/AddExhibition";
import EditExhibition from "../../components/admin/Exhibition/EditExhibition";

const Exhibition = () => {
  const dispatch = useDispatch();
  const { exhibitions, isLoading, error } = useSelector(
    (state) => state.exhibition
  );

  // Pagination and search state
  const [limit, setLimit] = useState(5); // Items per page
  const [currPage, setCurrPage] = useState(0); // Current page
  const [searchQuery, setSearchQuery] = useState(""); // Search input state

  // Filter exhibitions based on the search query
  const filteredExhibitions = exhibitions.filter((exhibition) =>
    exhibition.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination based on filtered results
  const totalPages = Math.ceil(filteredExhibitions.length / limit);
  const paginatedExhibitions = filteredExhibitions.slice(
    currPage * limit,
    (currPage + 1) * limit
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedExhibition, setEditedExhibition] = useState(null);

  const handleDelete = async (id) => {
    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      dispatch(deleteExhibition(id)).then(() => {
        dispatch(getExhibitions()); // Reload exhibitions after deletion
      });
      Swal.fire("Deleted!", "The exhibition has been deleted.", "success");
    }
  };

  const handleEdit = (exhibition) => {
    setEditedExhibition(exhibition);
    setShowEditForm(true);
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrPage(0); // Reset to the first page when searching
  };

  useEffect(() => {
    dispatch(getExhibitions());
  }, [dispatch]);

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Exhibitions
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search exhibitions..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border py-2 px-4 text-black dark:text-white"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary py-2 px-6 text-white"
            >
              Add Exhibition
            </button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading exhibitions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
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
                  <th class="p-4 font-medium text-black dark:text-white">
                    Date
                  </th>
                  <th class="p-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedExhibitions.map((exhibition) => (
                  <tr key={exhibition._id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {exhibition.name}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {exhibition.description}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {new Date(exhibition.date).toDateString()}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center text-lg gap-2.5">
                        <button onClick={() => handleEdit(exhibition)}>
                          <i className="ri-edit-box-line hover-text-primary"></i>
                        </button>
                        <button onClick={() => handleDelete(exhibition._id)}>
                          <i className="ri-delete-bin-6-line hover-text-primary"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

        {showAddForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <AddExhibition onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {showEditForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <EditExhibition
              exhibition={editedExhibition}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Exhibition;
