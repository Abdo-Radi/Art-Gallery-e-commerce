import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteCategory, getCategories } from "../../redux/features/category"
import AddCategory from "../../components/admin/Category/AddCategory"

const Category = () => {
    const { categories } = useSelector(state => state.category)
    const dispatch = useDispatch()


    const [addForm, setAddForm] = useState(false)

    const showAddForm = () => {
        setAddForm(true)
    }

    const hideAddForm = () => {
        setAddForm(false)
    }

    const handleDelete = async (id) => {
        dispatch(deleteCategory(id))
    }

    useEffect(() => {
        dispatch(getCategories())
    }, [])

    return (
        <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-title-lg font-semibold text-black dark:text-white">
                        Categories
                    </h2>
                    <button onClick={showAddForm} className="bg-primary py-2 px-6 text-white">
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
                            {categories && categories.map((category, key) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {category.name}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {category.description}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center text-lg gap-2.5">
                                            <button>
                                                <i className="ri-edit-box-line hover:text-primary"></i>
                                            </button>
                                            <button onClick={() => handleDelete(category._id)}>
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
                    {<AddCategory onCancel={hideAddForm} />}
                </div>
            )}
        </div>
    )
}

export default Category