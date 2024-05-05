import { useDispatch, useSelector } from "react-redux"
import { deleteArtwork, getArtworks } from "../../redux/features/artwork"
import { useState, useEffect } from "react"
import AddArtwork from "../../components/admin/Artwork/AddArtwork"
import EditArtwork from "../../components/admin/Artwork/EditArtwork"

const Artwork = () => {
    const { artworks } = useSelector(state => state.artwork)
    const dispatch = useDispatch()


    const [addForm, setAddForm] = useState(false)
    const [editForm, setEditForm] = useState(false)
    const [editedArtwork, setEditedArtwork] = useState(null)

    const showAddForm = () => {
        setAddForm(true)
    }

    const hideAddForm = () => {
        setAddForm(false)
    }


    const showEditForm = (artwork) => {
        setEditedArtwork(artwork)
        setEditForm(true)
    }

    const hideEditForm = () => {
        setEditForm(false)
    }

    const handleDelete = async (id) => {
        dispatch(deleteArtwork(id))
    }

    useEffect(() => {
        dispatch(getArtworks())
    }, [])

    return (
        <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-title-lg font-semibold text-black dark:text-white">
                        Artworks
                    </h2>
                    <button onClick={showAddForm} className="bg-primary py-2 px-6 text-white">
                        Add Artwork
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="p-4 font-medium text-black dark:text-white">
                                    Artwork Title
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
                            {artworks && artworks.map((artwork, key) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex items-center gap-3">
                                        <div className="h-12.5 w-15 flex items-center justify-center">
                                            <img
                                                src={`http://localhost:3002/images/${artwork.image}`}
                                                className="h-full"
                                                alt="" />
                                        </div>
                                        <p className="text-black dark:text-white">
                                            {artwork.title}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {artwork.artist.firstName} {artwork.artist.lastName}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {artwork.category.name}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {artwork.price}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center text-lg gap-2.5">
                                            <button onClick={()=> showEditForm(artwork)}>
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
            </div>
            {addForm && (
                <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
                    {<AddArtwork onCancel={hideAddForm} />}
                </div>
            )}
            {editForm && (
                <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
                    {<EditArtwork artwork={editedArtwork} onCancel={hideEditForm} />}
                </div>
            )}
        </div>
    )
}

export default Artwork