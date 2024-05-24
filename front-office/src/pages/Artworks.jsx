import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArtworks } from "@/redux/slices/artwork";
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

const Artworks = () => {
  const dispatch = useDispatch();

  const { list: artworks, pages } = useSelector((state) => state.artworks);
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

  useEffect(() => {
    dispatch(getArtworks(params));
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
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="lowToHigh">Low to High</SelectItem>
                <SelectItem value="highToLow">High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="category">Artwork Style</Label>
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
            <p>{price}</p>
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
          {artworks.map((artwork, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg shadow-lg"
            >
              <Link className="absolute inset-0 z-10" href="#">
                <span className="sr-only">View artwork</span>
              </Link>
              <img
                alt="Artwork 5"
                className="h-64 w-full object-cover transition-all duration-300 group-hover:scale-105"
                height={400}
                src={artwork.image}
                style={{
                  aspectRatio: "400/400",
                  objectFit: "cover",
                }}
                width={400}
              />
              <div className="bg-white p-4 dark:bg-gray-900">
                <h3 className="text-lg font-semibold">{artwork.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {artwork.artist.firstName} {artwork.artist.lastName}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    {artwork.price} DH
                  </span>
                  <Button size="sm">Add to Cart</Button>
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

export default Artworks;
