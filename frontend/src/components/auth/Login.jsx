import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/authSlice";

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email_username: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData).unwrap();

      if (result.user) {
        dispatch(setCredentials({ user: result.user }));

        // Role-based default fallback
        const isAdmin = ["superAdmin", "admin", "employee"].includes(
          result.user.role
        );
        const defaultPath = isAdmin ? "/admin" : "/";

        // Post-login redirect to last attempted route (if any)
        let redirectPath = defaultPath;
        try {
          const intended = sessionStorage.getItem("postLoginRedirect");
          if (intended) {
            redirectPath = intended;
            sessionStorage.removeItem("postLoginRedirect");
          }
        } catch (_) {}

        toast.success(result.message || "Login successful!", {
          description: result.description || "Welcome back!",
        });

        if (onClose) onClose();
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      toast.error(error.data?.message || "Login failed");
    }
  };

  // Input field config
  const fields = [
    {
      id: "email_username",
      label: "Email or Username",
      type: "text",
      placeholder: "Enter your email or username",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-2">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div className="text-right text-sm text-foreground hover:text-accent hover:underline">
        <DialogClose asChild>
          <NavLink to="/forgot-password">Forgot Password?</NavLink>
        </DialogClose>
      </div>

      <Button className="w-full" variant="accent" isLoading={isLoading}>
        {isLoading ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
};

export default Login;
