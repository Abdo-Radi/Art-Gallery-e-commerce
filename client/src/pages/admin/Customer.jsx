import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import { deleteCustomer, getCustomers } from "../../redux/features/customer";
import AddCustomer from "../../components/admin/Customer/AddCustomer";
import EditCustomer from "../../components/admin/Customer/EditCustomer";

const CustomerPage = () => {
  const { customers } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(5);
  const [currPage, setCurrPage] = useState(0);
  const [search, setSearch] = useState("");

  const totalPages = Math.ceil(customers.length / limit);

  // Function to handle search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrPage(0); // Reset to the first page when searching
  };

  // Filter customers based on search keyword
  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate paginated customers based on filtered results
  const paginatedCustomers = filteredCustomers.slice(
    currPage * limit,
    (currPage + 1) * limit
  );

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (customer) => {
    setEditedCustomer(customer);
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
      dispatch(deleteCustomer(id));
      Swal.fire("Deleted!", "The customer has been deleted.", "success");
    }
  };

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Customers
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search customers"
              value={search}
              onChange={handleSearchChange}
              className="border py-2 px-4 text-black dark:text-white"
            />
            <button
              onClick={showAddForm}
              className="bg-primary py-2 px-6 text-white"
            >
              Add Customer
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
              {paginatedCustomers.map((customer, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {customer.username}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {customer.email}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center text-lg gap-2.5">
                      <button onClick={() => showEditForm(customer)}>
                        <i className="ri-edit-box-line hover-text-primary"></i>
                      </button>
                      <button onClick={() => handleDelete(customer._id)}>
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
            <AddCustomer onCancel={hideAddForm} />
          </div>
        )}

        {editForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <EditCustomer customer={editedCustomer} onCancel={hideEditForm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;
