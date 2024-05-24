import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import AddTicket from "../../components/admin/Ticket/AddTicket";
import EditTicket from "../../components/admin/Ticket/EditTicket";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTickets, deleteTicket } from "../../redux/slices/ticket";

const Ticket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, pages, reset } = useSelector((state) => state.tickets);

  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);

  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editedTicket, setEditedTicket] = useState(null);

  const showAddForm = () => setAddForm(true);
  const hideAddForm = () => setAddForm(false);

  const showEditForm = (ticket) => {
    setEditedTicket(ticket);
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
      dispatch(deleteTicket(id));
      Swal.fire("Deleted!", "The ticket has been deleted.", "success");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(getTickets(currentPage));

    const queryParams = new URLSearchParams();

    queryParams.set("page", currentPage);

    const newUrl = `/admin/tickets?${queryParams.toString()}`;
    navigate(newUrl);
  }, [dispatch, currentPage, reset]);

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark/text-white">
            Tickets
          </h2>

          <button
            onClick={showAddForm}
            className="w-40 bg-primary py-2 text-white"
          >
            Add Ticket
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark/bg-meta-4">
                <th className="p-4 font-medium text-black dark/text-white">
                  Exhibition
                </th>
                <th className="p-4 font-medium text-black dark/text-white">
                  Price
                </th>
                <th className="p-4 font-medium text-black dark/text-white">
                  Quantity
                </th>
                <th className="p-4 font-medium text-black dark/text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                    {ticket.exhibition.name}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                    {ticket.price} DH
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                    {ticket.quantity}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                    <div className="flex items-center text-lg gap-2.5">
                      <button onClick={() => showEditForm(ticket)}>
                        <i className="ri-edit-box-line hover-text-primary"></i>
                      </button>
                      <button onClick={() => handleDelete(ticket._id)}>
                        <i className="ri-delete-bin-6-line hover-text-primary"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
            <AddTicket onCancel={hideAddForm} />
          </div>
        )}

        {editForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <EditTicket ticket={editedTicket} onCancel={hideEditForm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;
