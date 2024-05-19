import { useState, useEffect } from "react";
import { BsFillGridFill, BsFillGrid3X3GapFill } from "react-icons/bs";
import { IoHeartOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getArtworks } from "../../../redux/features/artwork";
import { IoSearch } from "react-icons/io5";
import { getCategories } from "../../../redux/features/category";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const List = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getArtworks());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  const artworks = useSelector((state) => state.artwork.artworks);
  const {categories}  = useSelector((state) => state);
  console.log("categories",categories)
  console.log("artworks",artworks)
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
        (category.length === 0 || category.includes(artwork.category)) &&
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
  }, [category, minPrice, maxPrice, highToLow, lowToHigh]);
  useEffect(() => {
    const filtered = artworks.filter((artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Rest of your sorting and filtering logic using filtered artworks
  }, [
    searchTerm,
    artworks,
    category,
    minPrice,
    maxPrice,
    highToLow,
    lowToHigh,
  ]);

  const addToWishList = (artwork_id) => {
    toast("Added to wishlist");
  };
  useEffect(() => {
    const filtered = artworks.filter((artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredArtworks(filtered); // Update filtered artworks here
  }, [searchTerm, artworks]);
  return (
    <div className="flex">
      <div className="p-6 w-1/4">
        {/* Sidebar content */}
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
        <div className="p-6">
          <h3>Category</h3>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="children"
              value="children"
              checked={category.includes("children")}
              onChange={() => {
                setCategory((prevCategory) => {
                  if (prevCategory.includes("children")) {
                    return prevCategory.filter((item) => item !== "children");
                  } else {
                    return [...prevCategory, "children"];
                  }
                });
              }}
            />
            <label htmlFor="children">Children</label>
          </div>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="nature"
              value="nature"
              checked={category.includes("nature")}
              onChange={() => {
                setCategory((prevCategory) => {
                  if (prevCategory.includes("nature")) {
                    return prevCategory.filter((item) => item !== "nature");
                  } else {
                    return [...prevCategory, "nature"];
                  }
                });
              }}
            />
            <label htmlFor="nature">Nature</label>
          </div>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="cities-monuments"
              value="cities-monuments"
              checked={category.includes("cities-monuments")}
              onChange={() => {
                setCategory((prevCategory) => {
                  if (prevCategory.includes("cities-monuments")) {
                    return prevCategory.filter(
                      (item) => item !== "cities-monuments"
                    );
                  } else {
                    return [...prevCategory, "cities-monuments"];
                  }
                });
              }}
            />
            <label htmlFor="cities-monuments">Cities & Monuments</label>
          </div>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="motivation"
              value="motivation"
              checked={category.includes("motivation")}
              onChange={() => {
                setCategory((prevCategory) => {
                  if (prevCategory.includes("motivation")) {
                    return prevCategory.filter((item) => item !== "motivation");
                  } else {
                    return [...prevCategory, "motivation"];
                  }
                });
              }}
            />
            <label htmlFor="motivation">Motivation</label>
          </div>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="morocco"
              value="morocco"
              checked={category.includes("morocco")}
              onChange={() => {
                setCategory((prevCategory) => {
                  if (prevCategory.includes("morocco")) {
                    return prevCategory.filter((item) => item !== "morocco");
                  } else {
                    return [...prevCategory, "morocco"];
                  }
                });
              }}
            />
            <label htmlFor="morocco">Morocco</label>
          </div>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="islamic-calligraphy"
              value="islamic-calligraphy"
              checked={category.includes("islamic-calligraphy")}
              onChange={() => {
                setCategory((prevCategory) => {
                  if (prevCategory.includes("islamic-calligraphy")) {
                    return prevCategory.filter(
                      (item) => item !== "islamic-calligraphy"
                    );
                  } else {
                    return [...prevCategory, "islamic-calligraphy"];
                  }
                });
              }}
            />
            <label htmlFor="islamic-calligraphy">Islamic Calligraphy</label>
          </div>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="minimalist"
              value="minimalist"
              checked={category.includes("minimalist")}
              onChange={() => {
                setCategory((prevCategory) => {
                  if (prevCategory.includes("minimalist")) {
                    return prevCategory.filter((item) => item !== "minimalist");
                  } else {
                    return [...prevCategory, "minimalist"];
                  }
                });
              }}
            />
            <label htmlFor="minimalist">Minimalist</label>
          </div>
          <div>
            <input
              className="relative top-[-6px] mr-4"
              type="checkbox"
              id="abstract"
              value="abstract"
              checked={category.includes("abstract")}
              onChange={() => {
                setCategory((prevCategory) => {
                  if (prevCategory.includes("abstract")) {
                    return prevCategory.filter((item) => item !== "abstract");
                  } else {
                    return [...prevCategory, "abstract"];
                  }
                });
              }}
            />
            <label htmlFor="abstract">Abstract</label>
          </div>
          <br />
          <hr />
          <h3>Price Range</h3>
          <div className="flex gap-4">
            <input
              className="w-20 border-2 border-black bg-gray-200 rounded-md py-1 px-2 outline-none"
              type="text"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              className="w-20 border-2 border-black bg-gray-200 rounded-md py-1 px-2 outline-none"
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
      <div className="p-6 w-3/4">
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
              className="productcard bg-white p-4 rounded-lg shadow-md transition duration-200 hover:bg-black hover:text-white"
            >
              <Link
                style={{ textDecoration: "none" }}
                to={`/artworks/${artwork.id}`}
              >
                <img
                  src={artwork.image}
                  alt=""
                  className="h-72 w-full object-cover mb-2"
                />{" "}
              </Link>
              <h4 className="text-xl font-bold mb-2">{artwork.title}</h4>
              <div className="flex justify-between items-center">
                <span>{artwork.price} USD</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToWishList(artwork.id);
                    }}
                  >
                    <IoHeartOutline size={25} />
                  </button>
                  {/* Add to cart functionality button */}
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
