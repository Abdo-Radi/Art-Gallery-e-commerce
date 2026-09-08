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
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";
import { fetchCart } from "@/redux/slices/cart";
import Register from "./Register";
import Modal from "./Modal";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSchema = z.object({
  identifier: z.string().nonempty("Required Field"),
  password: z.string().nonempty("Required Field"),
});

const labelCls =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-stone";

const Login = ({ onClose }) => {
  const dispatch = useDispatch();

  const [registerForm, setRegisterForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

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
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="mt-3 font-display text-3xl font-bold">Sign in</h1>
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
          <form onSubmit={form.handleSubmit(login)} className="modal-form">
            <div className="modal-body space-y-5">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>
                      Email or username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        autoComplete="username"
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className="h-11 border-line bg-transparent pr-11"
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
            </div>

            <div className="modal-foot">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full text-[12px] font-semibold uppercase tracking-[0.15em]"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>

              <p className="mt-4 text-center text-sm text-stone">
                Not a member yet?
                <Button
                  type="button"
                  onClick={() => setRegisterForm(true)}
                  variant="link"
                  className="px-2 text-klein"
                >
                  Create an account
                </Button>
              </p>
            </div>
          </form>
        </Form>
      </div>

      {registerForm && (
        <Modal onClose={() => setRegisterForm(false)} label="Create an account">
          <Register onClose={() => setRegisterForm(false)} />
        </Modal>
      )}

      <ToastContainer />
    </>
  );
};

export default Login;
