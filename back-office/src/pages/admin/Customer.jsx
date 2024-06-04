import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import { deleteCustomer, getCustomers } from "../../redux/slices/customer";
import AddCustomer from "../../components/admin/Customer/AddCustomer";
import EditCustomer from "../../components/admin/Customer/EditCustomer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuInbox } from "react-icons/lu";

const CustomerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, pages, reset } = useSelector((state) => state.customers);

  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [search, setSearch] = useState(searchParams.get("search") || "");

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(getCustomers({ page: currentPage, search }));

    const queryParams = new URLSearchParams();
    if (search !== "") {
      queryParams.set("search", search);
    }

    queryParams.set("page", currentPage);

    const newUrl = `/admin/customers?${queryParams.toString()}`;
    navigate(newUrl);
  }, [dispatch, currentPage, search, reset]);

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Customers
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search customers"
              value={search}
              onChange={handleSearchChange}
              className="border border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            />
            <button
              onClick={showAddForm}
              className="w-40 bg-primary py-2 text-white"
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
              {list.map((customer, key) => (
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
