import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTickets } from "@/redux/slices/ticket";
import { getCategories } from "@/redux/slices/category";
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

const Tickets = () => {
  const dispatch = useDispatch();
  const { list: tickets, pages } = useSelector((state) => state.tickets);
  const { list: categories } = useSelector((state) => state.categories);
  const [price, setPrice] = useState(2500);
  const [currentPage, setCurrentPage] = useState(1);

  const [params, setParams] = useState({});

  const handleParams = (name, value) => {
    setParams({ ...params, [name]: value });
  };

  const resetParams = () => {
    setParams({});
    setPrice(2500);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleParams("page", page);
  };
  console.log("params",params)
  useEffect(() => {
    dispatch(getTickets(params));
    dispatch(getCategories());
  }, [params]);

  return (
    <section className="relative flex flex-col gap-6 lg:gap-12 lg:flex-row w-full py-12 px-4 md:px-6 lg:px-20">
      <div className="lg:w-[21%] space-y-8">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            onChange={(e) => {
              resetParams();
              handleParams("search", e.target.value);
            }}
            id="search"
            type="text"
            placeholder="Search"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="sort">Order</Label>
          <Select
            id="sort"
            onValueChange={(value) => handleParams("priceSort", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="lowToHigh">Low to High</SelectItem>
                <SelectItem value="highToLow">High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            onValueChange={(value) => handleParams("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories.map((category, i) => (
                  <SelectItem key={i} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="price">Price Range</Label>
            <p>{price} DH</p>
          </div>
          <Slider
            onValueChange={(value) => {
              setPrice(value[0]);
              handleParams("maxPrice", value[0]);
            }}
            defaultValue={[price]}
            max={5000}
            step={100}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Button onClick={resetParams}>Reset</Button>
        </div>
      </div>
      <div className="lg:w-[79%] space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {tickets.map((ticket, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg shadow-lg"
            >
              <Link
                className="absolute inset-0 z-10"
                to={`/ticket/${ticket._id}`}
              >
                <span className="sr-only">View ticket</span>
              </Link>
              <img
                alt={ticket.exhibition.name}
                className="h-64 w-full object-cover transition-all duration-300 group-hover:scale-105"
                height={400}
                src={ticket.exhibition.image}
                style={{
                  aspectRatio: "400/400",
                  objectFit: "cover",
                }}
                width={400}
              />
              <div className="bg-white p-4 dark:bg-gray-900">
                <h3 className="text-lg font-semibold">
                  {ticket.exhibition.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {ticket.price} DH
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    Quantity: {ticket.quantity}
                  </span>
                  <Button size="sm">Buy Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {pages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? `pointer-events-none opacity-45`
                      : `cursor-pointer`
                  }
                />
              </PaginationItem>

              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer"
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink
                  isActive
                  className="pointer-events-none opacity-50"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {currentPage < pages && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="cursor-pointer"
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
                      ? `pointer-events-none opacity-45`
                      : `cursor-pointer`
                  }
                  disabled={currentPage === pages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

export default Tickets;
