import { useState, useEffect } from "react";
import { BsFillGridFill, BsFillGrid3X3GapFill } from "react-icons/bs";
import { IoHeartOutline, IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addProductToCart, getArtworks } from "../../../redux/slices/artwork";
import { getCategories } from "../../../redux/slices/category"; // Import the getCategories action
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const List = () => {
  const dispatch = useDispatch();
  const { list: artworks } = useSelector((state) => state.artworks);
  const {list: categories} = useSelector((state) => state.categories); // Fix the selector for categories

  useEffect(() => {
    dispatch(getArtworks());
    dispatch(getCategories()); // Dispatch getCategories to fetch the categories
  }, [dispatch]);

  const [category, setCategory] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [highToLow, setHighToLow] = useState(false);
  const [lowToHigh, setLowToHigh] = useState(false);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [columns, setColumns] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");

  const handleColumnsChange = (newColumn) => {
    setColumns(newColumn);
  };

  useEffect(() => {
    setFilteredArtworks(artworks);
  }, [artworks]);

  useEffect(() => {
    const filtered = artworks.filter(
      (artwork) =>
        (category.length === 0 ||
          category.includes(artwork.category.name.toLowerCase())) &&
        (!minPrice || artwork.price >= parseFloat(minPrice)) &&
        (!maxPrice || artwork.price <= parseFloat(maxPrice))
    );

    const sorted = [...filtered].sort((a, b) => {
      if (highToLow) {
        return b.price - a.price;
      } else if (lowToHigh) {
        return a.price - b.price;
      }
      return 0;
    });

    setFilteredArtworks(sorted);
  }, [category, minPrice, maxPrice, highToLow, lowToHigh, artworks]);

  useEffect(() => {
    const filtered = artworks.filter((artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredArtworks(filtered);
  }, [searchTerm, artworks]);

  const addToWishList = (artwork_id) => {
    toast("Added to wishlist");
  };
  const addToCart = (id) => {
    dispatch(addProductToCart(id)).then((response) => {
      toast(response.payload.data);
    });
  };

  return (
    <div className="px-8 lg:px-24 flex">
      <div className="w-1/4">
        <ToastContainer />
        <div className="flex items-center border-b border-gray-300 py-6 px-4 w-full">
          <IoSearch size={30} className="text-gray-600 mr-8" />
          <input
            type="text"
            placeholder="Search..."
            className="text-lg outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="">
          <h3>Category</h3>
          {categories.map((cat) => (
            <div key={cat.id}>
              <input
                className="relative top-[-6px] mr-4"
                type="checkbox"
                id={cat.name}
                value={cat.name}
                checked={category.includes(cat.name.toLowerCase())}
                onChange={() => {
                  setCategory((prevCategory) =>
                    prevCategory.includes(cat.name.toLowerCase())
                      ? prevCategory.filter(
                          (item) => item !== cat.name.toLowerCase()
                        )
                      : [...prevCategory, cat.name.toLowerCase()]
                  );
                }}
              />
              <label htmlFor={cat.name}>{cat.name.replace(/-/g, " ")}</label>
            </div>
          ))}
          <br />
          <hr />
          <h3>Price Range</h3>
          <div className="flex gap-4">
            <input
              className="w-20 border-2 border-black bg-gray-200 py-1 px-2 outline-none"
              type="text"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              className="w-20 border-2 border-black bg-gray-200 py-1 px-2 outline-none"
              type="text"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <br />
          <hr />
          <h3>Sort Price</h3>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="high-to-low"
              checked={highToLow}
              onChange={() => {
                setHighToLow(!highToLow);
                setLowToHigh(false);
              }}
            />
            <label htmlFor="high-to-low">High to Low</label>
            <br />
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="low-to-high"
              checked={lowToHigh}
              onChange={() => {
                setLowToHigh(!lowToHigh);
                setHighToLow(false);
              }}
            />
            <label htmlFor="low-to-high">Low to High</label>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <div className="flex justify-end gap-2 mb-4">
          <button onClick={() => handleColumnsChange(2)}>
            <BsFillGridFill size={25} />
          </button>
          <button onClick={() => handleColumnsChange(3)}>
            <BsFillGrid3X3GapFill size={25} />
          </button>
        </div>
        <div
          className={`grid gap-6 ${
            columns === 2 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="productcard bg-white p-4 shadow-md transition duration-200 hover:bg-black hover:text-white"
            >
              <Link
                style={{ textDecoration: "none" }}
                to={`/artworks/${artwork.id}`}
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="h-72 w-full object-cover mb-2"
                />
              </Link>
              <h4 className="text-xl font-bold mb-2">{artwork.title}</h4>
              <div className="flex justify-between items-center">
                <span>{artwork.price} USD</span>
                <div className="flex gap-2">
                  <button onClick={() => addToWishList(artwork)}>
                    <IoHeartOutline size={25} />
                  </button>
                  <button
                    onClick={() => addToCart(artwork)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                      +
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
