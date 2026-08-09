import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getExhibitions } from "@/redux/slices/exhibition";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { addItemToCart } from "@/redux/slices/cart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const filterLabel =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-stone";

const Exhibitions = () => {
  const dispatch = useDispatch();
  const { list: exhibitions, pages } = useSelector(
    (state) => state.exhibitions
  );
  const { data: userData } = useSelector((state) => state.currentUser);

  const [price, setPrice] = useState(750);
  const [currentPage, setCurrentPage] = useState(1);

  const [params, setParams] = useState({});

  // Functional updates avoid stale-state overwrites when several params
  // change in the same event; changing any filter resets pagination.
  const handleParams = (name, value) => {
    if (name !== "page") setCurrentPage(1);
    setParams((prev) => {
      const next = { ...prev, [name]: value };
      if (name !== "page") delete next.page;
      return next;
    });
  };

  const resetParams = () => {
    setParams({});
    setPrice(750);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setParams((prev) => ({ ...prev, page }));
  };

  const showToastMessage = (message) => {
    toast(message, {
      position: "top-right",
      autoClose: 1500,
    });
  };

  useEffect(() => {
    dispatch(getExhibitions(params));
  }, [dispatch, params]);

  return (
    <>
      {/* Page header */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:px-8">
          <p className="eyebrow">On view</p>
          <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">
            Exhibitions
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-stone">
            Book your ticket online and stand in front of the work — the way it
            was meant to be seen.
          </p>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-14 md:px-6 lg:flex-row lg:gap-16 lg:px-8">
        {/* Filters */}
        <aside className="shrink-0 lg:w-60">
          <div className="space-y-9 lg:sticky lg:top-24">
            <div className="flex flex-col space-y-2.5">
              <Label htmlFor="search" className={filterLabel}>
                Search
              </Label>
              <Input
                onChange={(e) => {
                  // Searching starts a fresh query: clear the other filters.
                  setPrice(750);
                  setCurrentPage(1);
                  setParams(e.target.value ? { search: e.target.value } : {});
                }}
                id="search"
                type="text"
                placeholder="Name of an exhibition…"
                className="h-10 border-line bg-transparent"
              />
            </div>
            <div className="flex flex-col space-y-2.5">
              <Label htmlFor="sort" className={filterLabel}>
                Order
              </Label>
              <Select
                id="sort"
                onValueChange={(value) => handleParams("priceSort", value)}
              >
                <SelectTrigger className="h-10 border-line bg-transparent">
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent className="border-line bg-paper">
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="lowToHigh">Price — low to high</SelectItem>
                    <SelectItem value="highToLow">Price — high to low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2.5">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="price" className={filterLabel}>
                  Max price
                </Label>
                <p className="font-display text-sm tabular-nums">{price} DH</p>
              </div>
              <Slider
                onValueChange={(value) => {
                  setPrice(value[0]);
                  handleParams("maxPrice", value[0]);
                }}
                value={[price]}
                max={1500}
                step={50}
              />
            </div>
            <Button
              onClick={resetParams}
              variant="outline"
              className="h-10 w-full border-stone/30 text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-klein hover:text-klein"
            >
              Reset filters
            </Button>
          </div>
        </aside>

        {/* Grid */}
        <div className="min-w-0 flex-1 space-y-16">
          {exhibitions.length === 0 && (
            <p className="py-20 text-center font-display text-lg italic text-stone">
              No exhibitions match these filters — try widening the search.
            </p>
          )}
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {exhibitions.map((exhibition) => (
              <div key={exhibition._id} className="group">
                <Link
                  to={exhibition._id}
                  className="block overflow-hidden border border-line bg-secondary"
                >
                  <img
                    alt={exhibition.name}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    src={exhibition.image}
                  />
                </Link>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                    {new Date(exhibition.date).toDateString()}
                  </p>
                  <div className="mt-1 flex items-baseline justify-between gap-4">
                    <Link to={exhibition._id} className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold italic transition-colors hover:text-klein">
                        {exhibition.name}
                      </h3>
                    </Link>
                    <p className="whitespace-nowrap font-display text-lg tabular-nums">
                      {exhibition.price} DH
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
                      {exhibition.quantity} tickets left
                    </span>
                    <button
                      onClick={() => {
                        if (!userData) {
                          showToastMessage("Please login to buy tickets!");
                          return;
                        }
                        dispatch(
                          addItemToCart({
                            customer: userData?._id,
                            product: exhibition._id,
                            productType: "Exhibition",
                            quantity: 1,
                          })
                        ).then((res) => {
                          showToastMessage(
                            res.payload?.message ??
                              res.payload ??
                              "Something went wrong"
                          );
                        });
                      }}
                      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-klein transition-colors hover:text-klein-deep"
                    >
                      Book ticket +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pages > 1 && (
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? `pointer-events-none opacity-40`
                        : `cursor-pointer hover:text-klein`
                    }
                  />
                </PaginationItem>

                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="cursor-pointer hover:text-klein"
                    >
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink
                    isActive
                    className="pointer-events-none border-klein bg-klein text-paper"
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>

                {currentPage < pages && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="cursor-pointer hover:text-klein"
                    >
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === pages
                        ? `pointer-events-none opacity-40`
                        : `cursor-pointer hover:text-klein`
                    }
                    disabled={currentPage === pages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Exhibitions;
