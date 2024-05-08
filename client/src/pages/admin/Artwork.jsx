import { useDispatch, useSelector } from "react-redux";
import { deleteArtwork, getArtworks } from "../../redux/features/artwork";
import { useState, useEffect } from "react";
import AddArtwork from "../../components/admin/Artwork/AddArtwork";
import EditArtwork from "../../components/admin/Artwork/EditArtwork";

const Artwork = () => {
  const { artworks } = useSelector((state) => state.artwork);
  const dispatch = useDispatch();

  // State for managing pagination
  const [limit, setLimit] = useState(10); // Number of items per page
  const [currPage, setCurrPage] = useState(0); // Current page
  const totalPages = Math.ceil(artworks.length / limit); // Total number of pages
  const paginatedArtworks = artworks.slice(currPage * limit, (currPage + 1) * limit); // Artworks to display on current page

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedArtwork, setEditedArtwork] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (artwork) => {
    setEditedArtwork(artwork);
    setEditForm(true);
  };

  const hideEditForm = () => setEditForm(false);

  const handleDelete = async (id) => {
    dispatch(deleteArtwork(id));
  };

  useEffect(() => {
    dispatch(getArtworks());
  }, [dispatch]);

  // Filter artworks based on search query
  const filteredArtworks = paginatedArtworks.filter((artwork) =>
    artwork.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Artworks
          </h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border py-2 px-4 text-black dark:text-white mr-80"
            />
            <button
              onClick={showAddForm}
              className="bg-primary py-2 px-6 text-white ml-3"
            >
              Add Artwork
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="p-4 font-medium text-black dark:text-white">Title</th>
                <th className="p-4 font-medium text-black dark:text-white">Artist</th>
                <th className="p-4 font-medium text-black dark:text-white">Price</th>
                <th className="p-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtworks.map((artwork, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {artwork.title}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {artwork.artistName}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    ${artwork.price}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center text-lg gap-2.5">
                      <button onClick={() => showEditForm(artwork)}>
                        <i className="ri-edit-box-line hover:text-primary"></i>
                      </button>
                      <button onClick={() => handleDelete(artwork._id)}>
                        <i className="ri-delete-bin-6-line hover:text-primary"></i>
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
                className={`px-3 py-1 ${currPage === i ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {addForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          <AddArtwork onCancel={hideAddForm} />
        </div>
      )}

      {editForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          <EditArtwork artwork={editedArtwork} onCancel={hideEditForm} />
        </div>
      )}
    </div>
  );
};

export default Artwork;
