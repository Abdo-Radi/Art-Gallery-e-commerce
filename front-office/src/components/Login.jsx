import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "@/components/ui/card";
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

const formSchema = z.object({
  identifier: z.string().nonempty("Required Field"),
  password: z.string().nonempty("Required Field"),
});

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
      onClose();
    } catch (error) {
      showErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <Card className="w-96 px-4 py-12 lg:px-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl">Login</h1>
          <RiCloseFill className="cursor-pointer" onClick={onClose} size={24} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(login)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifier</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <div className="w-full text-center mt-4">
          You are not a member?
          <Button
            onClick={() => setRegisterForm(true)}
            variant="link"
            className="px-2"
          >
            Register
          </Button>
        </div>
      </Card>
      {registerForm && (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-50">
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
