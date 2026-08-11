import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";

const SignIn = () => {
  const schema = z.object({
    identifier: z.string().nonempty("Required field"),
    password: z.string().nonempty("Required field"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const showErrorMessage = (message) => {
    toast.error(message);
  };

  const login = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/login",
        { ...data, accountType: "admin" },
        { withCredentials: true }
      );
      const token = response.data.token;

      localStorage.setItem("token", token);
      navigate("/admin");
    } catch (error) {
      showErrorMessage(
        error.response?.data?.message ?? "Login failed. Please try again."
      );
    }
  };

  return (
    /*
      The grid holds exactly two items. Anything else rendered here — notably
      react-toastify's static wrapper div — becomes a third grid item, wraps to
      a second row and steals half the min-h-screen height. Keep siblings out.
    */
    <>
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-ink-deep p-12 lg:flex">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl font-bold text-paper">
              Horizons
            </span>
            <span className="mb-1 inline-block h-2 w-2 bg-klein" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/55">
              Gallery admin
            </p>
            <h1 className="mt-5 max-w-md font-display text-4xl font-bold leading-tight text-paper">
              The room behind
              <br />
              the white cube.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/60">
              Manage the collection, the programme and the people who keep the
              gallery running.
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-paper/45">
            © 2026 Horizons
          </p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center bg-paper p-6 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-10 flex items-baseline gap-1.5 lg:hidden">
              <span className="font-display text-2xl font-bold text-ink">
                Horizons
              </span>
              <span className="mb-0.5 inline-block h-1.5 w-1.5 bg-klein" />
            </div>

            <p className="admin-eyebrow">Welcome back</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">
              Sign in
            </h2>
            <p className="mt-3 text-sm text-stone">Administrator access only.</p>

            <form onSubmit={handleSubmit(login)} className="mt-10 space-y-5">
              <div>
                <label htmlFor="identifier" className="label-cap mb-2 block">
                  Email or username <span className="text-danger">*</span>
                </label>
                <input
                  {...register("identifier")}
                  id="identifier"
                  type="text"
                  placeholder="you@example.com"
                  className="input-field"
                />
                {errors.identifier && (
                  <span className="field-error">
                    {errors.identifier.message}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label-cap mb-2 block">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="input-field"
                />
                {errors.password && (
                  <span className="field-error">{errors.password.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default SignIn;
