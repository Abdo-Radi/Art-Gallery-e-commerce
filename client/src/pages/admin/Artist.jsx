import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteArtist, getArtists } from "../../redux/features/artist";
import AddArtist from "../../components/admin/Artist/AddArtist";
import EditArtist from "../../components/admin/Artist/EditArtist";
import Swal from "sweetalert2"; // Import SweetAlert2

const Artist = () => {
  const { artists } = useSelector((state) => state.artist);
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(5);
  const [currPage, setCurrPage] = useState(0);
  const [search, setSearch] = useState("");

  const filteredArtists = artists.filter((artist) =>
    `${artist.firstName} ${artist.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArtists.length / limit);
  const paginatedArtists = filteredArtists.slice(
    currPage * limit,
    (currPage + 1) * limit
  );

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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      dispatch(deleteArtist(id));
      Swal.fire("Deleted!", "The artist has been deleted.", "success");
    }
  };

  useEffect(() => {
    dispatch(getArtists());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrPage(0);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Artists
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search artists"
              value={search}
              onChange={handleSearchChange}
              className="border py-2 px-4 text-black dark:text-white"
            />
            <button
              onClick={showAddForm}
              className="bg-primary py-2 px-6 text-white"
            >
              Add Artist
            </button>
          </div>
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
              {paginatedArtists.map((artist, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {artist.firstName} {artist.lastName}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {artist.username}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {artist.email}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center text-lg gap-2.5">
                      <button onClick={() => showEditForm(artist)}>
                        <i className="ri-edit-box-line hover:text-primary"></i>
                      </button>
                      <button onClick={() => handleDelete(artist._id)}>
                        <i className="ri-delete-bin-6-line hover-text-primary"></i>
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

        {addForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <AddArtist onCancel={hideAddForm} />
          </div>
        )}

        {editForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <EditArtist artist={editedArtist} onCancel={hideEditForm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Artist;
