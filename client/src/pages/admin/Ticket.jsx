import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  fetchTickets,
  deleteTicket,
  editTicket,
} from "../../redux/slices/ticket";
import AddTicket from "../../components/admin/Ticket/AddTicket";
import EditTicket from "../../components/admin/Ticket/EditTicket";

const TicketPage = () => {
  const dispatch = useDispatch();
  const { tickets, isLoading, error } = useSelector((state) => state.ticket);

  const [limit, setLimit] = useState(5);
  const [currPage, setCurrPage] = useState(0);
  const totalPages = Math.ceil(tickets.length / limit);
  const paginatedTickets = tickets.slice(
    currPage * limit,
    (currPage + 1) * limit
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedTicket, setEditedTicket] = useState(null);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleDelete = async (ticketId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      dispatch(deleteTicket(ticketId)); // Delete the ticket by ID
      Swal.fire("Deleted!", "The ticket has been deleted.", "success"); // Show success message
      dispatch(fetchTickets()); // Refresh the tickets after deletion
    }
  };

  const handleEdit = (ticket) => {
    setEditedTicket(ticket);
    setShowEditForm(true);
  };

  const cancelEdit = () => {
    setShowEditForm(false);
    setEditedTicket(null);
  };

  const updateTicket = (updatedTicketData) => {
    dispatch(
      editTicket({ ticketId: editedTicket._id, ticketData: updatedTicketData })
    );
    setShowEditForm(false);
    setEditedTicket(null);
    dispatch(fetchTickets());
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark/text-white">
            Tickets
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary py-2 px-6 text-white"
          >
            Add Ticket
          </button>
        </div>

        {isLoading ? (
          <p>Loading tickets...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark/bg-meta-4">
                    <th className="p-4 font-medium text-black dark/text-white">
                      Ticket ID
                    </th>
                    <th className="p-4 font-medium text-black dark/text-white">
                      Exhibition ID
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
                  {paginatedTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                        {ticket._id}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                        {ticket.exhibitionId}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                        {ticket.price.toFixed(2)}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                        {ticket.quantity}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark/border-strokedark">
                        <div className="flex items-center text-lg gap-2.5">
                          <button onClick={() => handleEdit(ticket)}>
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
          </>
        )}

        {showAddForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <AddTicket onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {showEditForm && (
          <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
            <EditTicket
              ticket={editedTicket}
              onCancel={cancelEdit}
              onUpdate={updateTicket}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
