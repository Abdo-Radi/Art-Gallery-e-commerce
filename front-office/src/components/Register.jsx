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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSchema = z
  .object({
    firstName: z.string().min(1, { message: "Required Field" }),
    lastName: z.string().min(1, { message: "Required Field" }),
    username: z.string().min(1, { message: "Required Field" }),
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

const labelCls = "text-[11px] font-semibold uppercase tracking-[0.18em] text-stone";
const inputCls = "h-10 border-line bg-transparent";

const Register = ({ onClose }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
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
      showErrorMessage(
        error.response?.data?.message ?? "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="no-scrollbar max-h-[85vh] w-[26rem] max-w-[calc(100vw-2rem)] overflow-y-auto border border-line bg-paper px-8 py-10 shadow-2xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="eyebrow">Join the gallery</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">Register</h1>
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
        <form onSubmit={form.handleSubmit(register)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane" className={inputCls} {...field} />
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
                  <FormLabel className={labelCls}>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" className={inputCls} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Username</FormLabel>
                <FormControl>
                  <Input placeholder="janedoe" className={inputCls} {...field} />
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
                <FormLabel className={labelCls}>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    className={inputCls}
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
                  <Input type="password" className={inputCls} {...field} />
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
                <FormLabel className={labelCls}>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" className={inputCls} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="h-11 w-full text-[12px] font-semibold uppercase tracking-[0.15em]"
          >
            Create account
          </Button>
        </form>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Register;
