import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { RiCloseFill } from "react-icons/ri";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/api/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";
import { fetchCart } from "@/redux/slices/cart";
import Register from "./Register";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSchema = z.object({
  identifier: z.string().nonempty("Required Field"),
  password: z.string().nonempty("Required Field"),
});

const labelCls = "text-[11px] font-semibold uppercase tracking-[0.18em] text-stone";

const Login = ({ onClose }) => {
  const dispatch = useDispatch();

  const [registerForm, setRegisterForm] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 1500,
    });
  };

  const login = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/login",
        { ...data, accountType: "customer" },
        { withCredentials: true }
      );

      const { user, token } = response.data;

      dispatch(setUser(user));
      dispatch(fetchCart(user._id));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (onClose) onClose();
    } catch (error) {
      showErrorMessage(
        error.response?.data?.message ?? "Login failed. Please try again."
      );
    }
  };

  return (
    <>
      <div className="w-[26rem] max-w-[calc(100vw-2rem)] border border-line bg-paper px-8 py-10 shadow-2xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-3 font-display text-3xl font-semibold">Sign in</h1>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone transition-colors hover:text-klein"
            aria-label="Close"
          >
            <RiCloseFill size={24} />
          </button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(login)} className="space-y-5">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Email or username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="h-11 border-line bg-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="h-11 border-line bg-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-11 w-full text-[12px] font-semibold uppercase tracking-[0.15em]"
            >
              Sign in
            </Button>
          </form>
        </Form>
        <div className="mt-6 border-t border-line pt-5 text-center text-sm text-stone">
          Not a member yet?
          <Button
            onClick={() => setRegisterForm(true)}
            variant="link"
            className="px-2 text-klein"
          >
            Create an account
          </Button>
        </div>
      </div>
      {registerForm && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-stone/50 backdrop-blur-sm">
          <Register
            onClose={() => {
              setRegisterForm(false);
            }}
          />
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Login;
