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
import { ToastContainer, toast } from "react-toastify";

const formSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const Register = ({ onClose }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 1500,
    });
  };

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 1500,
    });
  };

  const register = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/register",
        { ...data, accountType: "customer" },
        {
          withCredentials: true,
        }
      );
      showSuccessMessage(response.data.message);
      onClose();
    } catch (error) {
      showErrorMessage(error.response.data.message);
    }
  };

  return (
    <Card className="w-96 h-5/6 overflow-scroll no-scrollbar px-4 py-12 lg:px-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl">Register</h1>
        <RiCloseFill className="cursor-pointer" onClick={onClose} size={24} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(register)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Arkadian" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="ARKADIAN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="arkadian123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default Register;
