import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExhibitions,
  deleteExhibition,
} from "../../redux/features/exhibition";
import AddExhibition from "../../components/admin/Exhibition/AddExhibition";
import EditExhibition from "../../components/admin/Exhibition/EditExhibition";

const Exhibition = () => {
  const dispatch = useDispatch();

  const { exhibitions, isLoading, error } = useSelector(
    (state) => state.exhibition
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedExhibition, setEditedExhibition] = useState(null);

  useEffect(() => {
    dispatch(getExhibitions());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteExhibition(id)).then(() => {
      dispatch(getExhibitions());
    });
  };

  const handleExhibitionCreated = () => {
    dispatch(getExhibitions());
    setShowAddForm(false);
  };

  const handleEdit = (exhibition) => {
    setEditedExhibition(exhibition);
    setShowEditForm(true);
  };

  const handleExhibitionEdited = () => {
    dispatch(getExhibitions());
    setShowEditForm(false);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Exhibitions
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary py-2 px-6 text-white"
          >
            Add Exhibition
          </button>
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
                  <th className="p-4 font-medium text-black dark:text-white">
                    Date
                  </th>
                  <th className="p-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {exhibitions.map((exhibition) => (
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
                      <div className="flex items-center gap-2.5 text-lg">
                        <button onClick={() => handleEdit(exhibition)}>
                          <i className="ri-edit-box-line hover:text-primary"></i>
                        </button>
                        <button onClick={() => handleDelete(exhibition._id)}>
                          <i className="ri-delete-bin-6-line hover:text-primary"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showAddForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <AddExhibition
              onCancel={() => setShowAddForm(false)}
              onExhibitionCreated={handleExhibitionCreated}
            />
          </div>
        )}

        {showEditForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <EditExhibition
              exhibition={editedExhibition}
              onCancel={() => setShowEditForm(false)}
              onExhibitionEdited={handleExhibitionEdited}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Exhibition;
