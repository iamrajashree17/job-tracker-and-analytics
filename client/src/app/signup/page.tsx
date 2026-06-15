"use client";

import Link from "next/link";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import validate from "validate.js";
import { useRouter } from "next/dist/client/components/navigation";

const constraints = {
  name: {
    presence: { allowEmpty: false },
    length: { minimum: 2, tooShort: "must be at least 2 characters" },
  },
  email: {
    presence: { allowEmpty: false },
    email: true,
  },
  password: {
    presence: { allowEmpty: false },
    length: { minimum: 8, tooShort: "must be at least 8 characters" },
  },
};

type Fields = { name: string; email: string; password: string };
type Errors = Partial<Record<keyof Fields, string[]>>;

export default function SignUp() {
  const router = useRouter();
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  }

  async function handleSubmit() {
    const result: Errors | undefined = validate(values, constraints);
    if (result) {
      setErrors(result);
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      await axios.post("/api/signup", values);
      setSuccess(true);
      setValues({ name: "", email: "", password: "" });
      router.push("/login");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data?.error ?? "Something went wrong")
          : "Something went wrong";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-centered">
      <div className="card w-full max-w-md p-8">
        <h1 className="page-title mb-1">
          Create an account
        </h1>
        <p className="text-muted mb-8">
          Start tracking your job applications
        </p>

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
            Account created!{" "}
            <Link href="/login" className="font-medium underline">
              Sign in
            </Link>
          </div>
        )}

        {serverError && (
          <div className="alert-error mb-6">
            {serverError}
          </div>
        )}

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          noValidate
        >
          <div>
            <label htmlFor="name" className="form-label">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={values.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
