import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteArtist, getArtists } from "../../redux/features/artist";
import AddArtist from "../../components/admin/Artist/AddArtist";
import EditArtist from "../../components/admin/Artist/EditArtist";

const Artist = () => {
  const { artists } = useSelector((state) => state.artist);
  const dispatch = useDispatch();

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedArtist, setEditedArtist] = useState(null);

  const showAddForm = () => {
    setAddForm(true);
  };

  const hideAddForm = () => {
    setAddForm(false);
  };

  const showEditForm = (artist) => {
    setEditedArtist(artist);
    setEditForm(true);
  };

  const hideEditForm = () => {
    setEditForm(false);
  };

  const handleDelete = async (id) => {
    dispatch(deleteArtist(id));
  };

  useEffect(() => {
    dispatch(getArtists());
  }, []);

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Artists
          </h2>
          <button
            onClick={showAddForm}
            className="bg-primary py-2 px-6 text-white"
          >
            Add Artist
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
              {artists &&
                artists.map((artist, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {artist.firstName} {artist.lastName}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {artist.username}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {artist.email}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center text-lg gap-2.5">
                        <button onClick={() => showEditForm(artist)}>
                          <i className="ri-edit-box-line hover:text-primary"></i>
                        </button>
                        <button onClick={() => handleDelete(artist._id)}>
                          <i className="ri-delete-bin-6-line hover:text-primary"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {addForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          {<AddArtist onCancel={hideAddForm} />}
        </div>
      )}
      {editForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          {<EditArtist artist={editedArtist} onCancel={hideEditForm} />}
        </div>
      )}
    </div>
  );
};

export default Artist;
