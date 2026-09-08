import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { RiCloseFill, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
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
import { useState } from "react";
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

const labelCls =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-stone";
const inputCls = "h-11 border-line bg-transparent";

const Register = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

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

  const { isSubmitting } = form.formState;

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
    <div className="modal-card">
      <div className="modal-head">
        <div>
          <p className="eyebrow">Join the gallery</p>
          <h1 className="mt-3 font-display text-3xl font-bold">
            Create account
          </h1>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-stone transition-colors hover:text-klein"
          aria-label="Close"
        >
          <RiCloseFill size={24} />
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(register)} className="modal-form">
          <div className="modal-body space-y-5">
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
                    <Input
                      placeholder="janedoe"
                      autoComplete="username"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-5 border-t border-line pt-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="At least 8 characters"
                          autoComplete="new-password"
                          className={`${inputCls} pr-11`}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone transition-colors hover:text-klein"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <RiEyeOffLine size={18} />
                          ) : (
                            <RiEyeLine size={18} />
                          )}
                        </button>
                      </div>
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
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Repeat the password"
                        autoComplete="new-password"
                        className={inputCls}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="modal-foot">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full text-[12px] font-semibold uppercase tracking-[0.15em]"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </div>
        </form>
      </Form>

      <ToastContainer />
    </div>
  );
};

export default Register;
