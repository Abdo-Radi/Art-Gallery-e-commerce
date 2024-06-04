import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddExhibition from "../../components/admin/Exhibition/AddExhibition";
import EditExhibition from "../../components/admin/Exhibition/EditExhibition";
import Swal from "sweetalert2";
import { LuInbox } from "react-icons/lu";
import {
  getExhibitions,
  deleteExhibition,
} from "../../redux/slices/exhibition";

const Exhibition = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, pages, reset } = useSelector((state) => state.exhibitions);

  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [search, setSearch] = useState(searchParams.get("search") || "");

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
    dispatch(getExhibitions({ page: currentPage, search }));

    const queryParams = new URLSearchParams();
    if (search !== "") {
      queryParams.set("search", search);
    }

    queryParams.set("page", currentPage);

    const newUrl = `/admin/exhibitions?${queryParams.toString()}`;
    navigate(newUrl);
  }, [dispatch, currentPage, search, reset]);

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Exhibitions
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search exhibitions"
              value={search}
              onChange={handleSearchChange}
              className="border border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            <button
              onClick={showAddForm}
              className="w-40 bg-primary py-2 text-white"
            >
              Add Exhibition
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="p-4 font-medium text-black dark:text-white">
                  Image
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Quantity
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Price
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((exhibition) => (
                <tr key={exhibition._id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <img
                      src={
                        exhibition.image || "https://via.placeholder.com/150"
                      }
                      alt={exhibition.name}
                      className="max-w-[100px] h-auto"
                    />
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {exhibition.name}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {exhibition.quantity}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {exhibition.price}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {new Date(exhibition.date).toDateString()}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center text-lg gap-2.5">
                      <button onClick={() => showEditForm(exhibition)}>
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

        {!list.length && (
          <div className="w-full flex flex-col justify-center items-center p-6">
            <LuInbox size={40} />
            <p>No Data</p>
          </div>
        )}

        {pages > 1 && (
          <div className="my-4 flex justify-center space-x-2">
            <button
              disabled={currentPage == 1}
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
              }}
              className={`w-8 h-8 border border-stroke ${
                currentPage == 1 && "text-stroke"
              }`}
            >
              <i className="ri-arrow-left-double-line"></i>
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 border border-stroke ${
                  currentPage == i + 1
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-200"
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
              className={`w-8 h-8 border border-stroke ${
                currentPage == pages && "text-stroke"
              }`}
            >
              <i className="ri-arrow-right-double-line"></i>
            </button>
          </div>
        )}

        {addForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <AddExhibition onCancel={hideAddForm} />
          </div>
        )}

        {editForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <EditExhibition
              exhibition={editedExhibition}
              onCancel={hideEditForm}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Exhibition;
