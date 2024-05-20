import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductToCart,
  decreaseProductQuantity,
  increaseProductQuantity,
  deleteProductFromCart,
} from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductToCart());
  }, [dispatch]);

  const products = useSelector((state) => state.cart.cart);
  const totalPrice = products.reduce(
    (sum, product) => sum + product.artwork.price * product.quantity,
    0
  );
// const totalPrice = 120
  const decreaseQuantity = (id) => {
    dispatch(decreaseProductQuantity(id));
  };

  const increaseQuantity = (id) => {
    dispatch(increaseProductQuantity(id));
  };

  const deleteFromCart = (id) => {
    console.log("delete",id)
    dispatch(deleteProductFromCart(id));
  };

  const checkoutFromCart = () => {
    console.log("Checkout clicked");
  };

  return (
    <React.Fragment>
      <section className="container mx-auto mt-10">
        {products.length ? (
          <div className="sm:flex shadow-md my-10">
            <div className="w-full sm:w-3/4 bg-white px-10 py-10">
              <div className="flex justify-between border-b pb-8">
                <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                <h2 className="font-semibold text-2xl">
                  {products.length} Items
                </h2>
              </div>
              {products.map((product, index) => (
                <div
                  key={index}
                  className="md:flex items-stretch py-8 md:py-10 lg:py-8 border-t border-gray-50"
                >
                  <div className="md:w-4/12 2xl:w-1/4 w-full">
                    <img
                      src={product.artwork.image}
                      alt={product.artwork.title}
                      className="h-full object-center object-cover md:block hidden"
                    />
                  </div>
                  <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
                    <p className="text-xs leading-3 text-gray-800 md:pt-0 pt-4">
                      {/* {product.product[0].sku} */}
                    </p>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-base font-black leading-none text-gray-800">
                        {product.artwork.title}
                      </p>
                      <div className="flex items-center">
                        <button
                          onClick={() => decreaseQuantity(product._id)}
                          className="bg-red-500 text-white px-2 py-1"
                        >
                          -
                        </button>
                        <span className="mx-2">{product.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(product._id)}
                          className="bg-red-500 text-white px-2 py-1"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-xs leading-3 text-gray-600 pt-2">
                      Price: {product.artwork.price} MAD
                    </p>
                    <p className="text-xs leading-3 text-gray-600 py-4">
                      {/* SKU: {product.product[0].sku} */}
                    </p>
                    <div className="flex items-center justify-between pt-5">
                      <div className="flex items-center">
                        <p
                          onClick={() => deleteFromCart(product._id)}
                          className="text-xs leading-3 underline text-red-500 pl-5 cursor-pointer"
                        >
                          Remove
                        </p>
                      </div>
                      <p className="text-base font-black leading-none text-gray-800">
                        {/* {product.product[0].price * product.quantity} MAD */}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/artworks">
                <a
                  href="#"
                  className="flex font-semibold text-indigo-600 text-sm mt-10"
                >
                  <svg
                    className="fill-current mr-2 text-indigo-600 w-4"
                    viewBox="0 0 448 512"
                  >
                    <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
                  </svg>
                  Continue Shopping
                </a>
              </Link>
            </div>
            <div id="summary" className="w-full sm:w-1/4 md:w-1/2 px-8 py-10">
              <h1 className="font-semibold text-2xl border-b pb-8">
                Order Summary
              </h1>
              <div className="flex justify-between mt-10 mb-5">
                <span className="font-semibold text-sm uppercase">
                  Items {products.length}
                </span>
                <span className="font-semibold text-sm">{totalPrice} MAD</span>
              </div>
              <div>
                <label className="font-medium inline-block mb-3 text-sm uppercase">
                  Shipping
                </label>
                <select className="block p-2 text-gray-600 w-full text-sm">
                  <option>Standard shipping - Free</option>
                </select>
              </div>
              <div className="py-10">
                <label
                  htmlFor="promo"
                  className="font-semibold inline-block mb-3 text-sm uppercase"
                >
                  Promo Code
                </label>
                <input
                  type="text"
                  id="promo"
                  placeholder="Enter your code"
                  className="p-2 text-sm w-full"
                />
              </div>
              <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase">
                Apply
              </button>
              <div className="border-t mt-8">
                <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                  <span>Total cost</span>
                  <span>{totalPrice} MAD</span>
                </div>
                <button
                  onClick={checkoutFromCart}
                  className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mt-5">
            <div className="jumbotron">
              <h1 className="display-4">Welcome to Our Website</h1>
              <p className="lead">
                Please log in to access the full features of our site.
              </p>
              <hr className="my-4" />
              <p>
                If you don't have an account, you can sign up{" "}
                <Link to={"/register/customer"} style={{ color: "red" }}>
                  here.
                </Link>
              </p>
              <p className="lead">
                <Link to={"/login/customer"}>
                  <a className="btn btn-danger btn-lg" role="button">
                    Log In
                  </a>
                </Link>
              </p>
            </div>
          </div>
        )}
      </section>
    </React.Fragment>
  );
}

export default Cart;
