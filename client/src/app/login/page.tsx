"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import validate from "validate.js";

const constraints = {
  email: {
    presence: { allowEmpty: false },
    email: true,
  },
  password: {
    presence: { allowEmpty: false },
    length: { minimum: 8, tooShort: "must be at least 8 characters" },
  },
};

type Fields = { email: string; password: string };
type Errors = Partial<Record<keyof Fields, string[]>>;

export default function Login() {
  const router = useRouter();
  const [values, setValues] = useState<Fields>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

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
      await axios.post("/api/login", values).then((res) => {
        router.push("/users");
      });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Sign in to your account
        </p>

        {serverError && (
          <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          New user?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
