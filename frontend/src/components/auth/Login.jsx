import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/api/authApi";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData).unwrap();
      toast.success(result.message || "Login successful", {
        description: "Welcome back!",
      });
    } catch (error) {
      toast.error(error.data?.message || "Login failed", {
        description:
          error.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  // Input field config
  const fields = [
    {
      id: "email",
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
