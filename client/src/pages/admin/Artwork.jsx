import { useDispatch, useSelector } from "react-redux";
import { deleteArtwork, getArtworks } from "../../redux/features/artwork";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // For confirmation dialog
import AddArtwork from "../../components/admin/Artwork/AddArtwork";
import EditArtwork from "../../components/admin/Artwork/EditArtwork";
import ArtworkViewPopup from "../../components/admin/Artwork/ArtworkView"; // Import the view popup

const Artwork = () => {
  const { artworks } = useSelector((state) => state.artwork);
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(5);
  const [selectedArtwork, setSelectedArtwork] = useState(null); // For managing which artwork to view
  const [isViewPopupVisible, setIsViewPopupVisible] = useState(false); // Popup visibility state
  const [currPage, setCurrPage] = useState(0);
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedArtwork, setEditedArtwork] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = Math.ceil(artworks.length / limit);
  const paginatedArtworks = artworks.slice(
    currPage * limit,
    (currPage + 1) * limit
  );

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (artwork) => {
    setEditedArtwork(artwork);
    setEditForm(true);
  };

  const hideEditForm = () => setEditForm(false);

  // Function to show the view popup
  const showViewPopup = (artwork) => {
    setSelectedArtwork(artwork);
    setIsViewPopupVisible(true);
  };

  const hideViewPopup = () => {
    setSelectedArtwork(null);
    setIsViewPopupVisible(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      dispatch(deleteArtwork(id));
      Swal.fire("Deleted!", "Artwork has been deleted.", "success");
    }
  };

  useEffect(() => {
    dispatch(getArtworks());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark/text-white">
            Artworks
          </h2>

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border py-2 px-4 text-black dark:text-white"
          />
          <button
            onClick={showAddForm}
            className="bg-primary py-2 px-6 text-white"
          >
            Add Artwork
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="p-4 font-medium text-black dark:text-white">
                  Title
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Artist
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Category
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Price
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedArtworks.map((artwork, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {artwork.title}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {artwork.artist?.firstName ?? "Unknown"}{" "}
                    {artwork.artist?.lastName ?? "Unknown"}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {artwork.category?.name ?? "Unknown"}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    ${artwork.price}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center text-lg gap-2.5">
                      <button onClick={() => showViewPopup(artwork)}>
                        <i className="ri-eye-line hover:text-primary"></i>{" "}
                        {/* View button */}
                      </button>
                      <button onClick={() => showEditForm(artwork)}>
                        <i className="ri-edit-box-line hover:text-primary"></i>
                      </button>
                      <button onClick={() => handleDelete(artwork._id)}>
                        <i class="ri-delete-bin-6-line hover:text-primary"></i>
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
          <AddArtwork onCancel={hideAddForm} />
        </div>
      )}

      {editForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          <EditArtwork artwork={editedArtwork} onCancel={hideEditForm} />
        </div>
      )}

      {isViewPopupVisible && (
        <ArtworkViewPopup artwork={selectedArtwork} onClose={hideViewPopup} />
      )}
    </div>
  );
};

export default Artwork;

