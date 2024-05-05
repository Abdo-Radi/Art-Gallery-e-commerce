import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets, deleteTicket } from "../../redux/features/ticket"; 
import AddTicket from "../../components/admin/Ticket/AddTicket"

const TicketPage = () => {
  const { tickets, isLoading, error } = useSelector((state) => state.ticket);
  const dispatch = useDispatch();

  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false); // To trigger re-fetch

  // Function to trigger data re-fetch
  const reloadTickets = () => {
    dispatch(fetchTickets());
  };

  // Re-fetch tickets every time refreshFlag changes
  useEffect(() => {
    reloadTickets(); // Fetch tickets on component mount and when refreshFlag changes
  }, [dispatch, refreshFlag]); // Added refreshFlag as a dependency

  const handleDelete = (ticketId) => {
    dispatch(deleteTicket(ticketId));
    setRefreshFlag((prev) => !prev); // Toggle refreshFlag to trigger re-fetch
  };

  return (
    <div className="border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-title-lg font-semibold text-black dark:text-white">
            Tickets
          </h2>
          <button
            onClick={() => {
              setShowAddForm(true);
              setRefreshFlag((prev) => !prev); // Toggle refreshFlag to trigger re-fetch after adding
            }}
            className="bg-primary py-2 px-6 text-white"
          >
            Add Ticket
          </button>
        </div>
        {isLoading && <p>Loading tickets...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="p-4 font-medium text-black dark:text-white">
                  Ticket ID
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Exhibition ID
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Price
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Quantity
                </th>
                <th className="p-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets &&
                tickets.map((ticket) => (
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
                        <button>
                          <i className="ri-edit-box-line hover:text-primary"></i>
                        </button>
                        <button onClick={() => handleDelete(ticket._id)}>
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

      {showAddForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-9999 bg-graydark bg-opacity-70">
          <AddTicket onCancel={() => setShowAddForm(false)} />
        </div>
      )}
    </div>
  );
};

export default TicketPage;
