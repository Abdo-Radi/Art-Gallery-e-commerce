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
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? 1)
  );

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
    navigate(newUrl, { replace: true });
  }, [dispatch, currentPage, reset]);

  return (
    <div className="animate-fade-up">
      <div className="page-head">
        <div>
          <p className="admin-eyebrow">Programme</p>
          <h1 className="page-title">Tickets</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={showAddForm} className="btn-primary">
            <i className="ri-add-line text-sm" />
            Add ticket
          </button>
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Exhibition</th>
              <th className="text-right">Price</th>
              <th className="text-right">Quantity</th>
              <th className="w-px text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="table-empty">
                  No tickets yet.
                </td>
              </tr>
            )}
            {list.map((ticket) => (
              <tr key={ticket._id}>
                <td className="font-medium">
                  {ticket.exhibition?.name || (
                    <span className="text-stone-light">—</span>
                  )}
                </td>
                <td className="text-right tabular-nums">{ticket.price} DH</td>
                <td className="text-right tabular-nums">{ticket.quantity}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="btn-icon"
                      title="Edit"
                      aria-label="Edit ticket"
                      onClick={() => showEditForm(ticket)}
                    >
                      <i className="ri-edit-box-line" />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title="Delete"
                      aria-label="Delete ticket"
                      onClick={() => handleDelete(ticket._id)}
                    >
                      <i className="ri-delete-bin-6-line" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            disabled={currentPage == 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
            }}
            className="page-btn"
            aria-label="Previous page"
          >
            <i className="ri-arrow-left-s-line" />
          </button>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`page-btn ${
                currentPage == i + 1 ? "page-btn-active" : ""
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
            className="page-btn"
            aria-label="Next page"
          >
            <i className="ri-arrow-right-s-line" />
          </button>
        </div>
      )}

      {addForm && (
        <div className="modal-scrim">
          <AddTicket onCancel={hideAddForm} />
        </div>
      )}

      {editForm && (
        <div className="modal-scrim">
          <EditTicket ticket={editedTicket} onCancel={hideEditForm} />
        </div>
      )}
    </div>
  );
};

export default Ticket;
