import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCustomer, getCustomers } from "../../redux/features/customer";
import AddCustomer from "../../components/admin/Customer/AddCustomer";

const CustomerPage = () => {
    const { customers } = useSelector(state => state.customer);
    const dispatch = useDispatch();
    const [addForm, setAddForm] = useState(false);

    const showAddForm = () => {
        setAddForm(true);
    };

    const hideAddForm = () => {
        setAddForm(false);
    };

    const handleDelete = async (id) => {
        dispatch(deleteCustomer(id));
    };

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    return (
        <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-title-lg font-semibold text-black dark:text-white">
                        Customers
                    </h2>
                    <button onClick={showAddForm} className="bg-primary py-2 px-6 text-white">
                        Add Customer
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
                            {customers && customers.map((customer, key) => (
                                <tr key={key}>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {customer.firstName} {customer.lastName}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {customer.username}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
                                            {customer.email}
                                        </p>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <div className="flex items-center text-lg gap-2.5">
                                            <button>
                                                <i className="ri-edit-box-line hover:text-primary"></i>
                                            </button>
                                            <button onClick={() => handleDelete(customer._id)}>
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
                    {<AddCustomer onCancel={hideAddForm} />}
                </div>
            )}
        </div>
    );
};

export default CustomerPage;
