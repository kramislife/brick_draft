import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/api/authApi";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    contactNumber: "",
    emailAddress: "",
    newPassword: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match.",
      });
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("Terms agreement required", {
        description:
          "You must agree to the Terms of Service and Privacy Policy.",
      });
      return;
    }

    // Prepare data for API
    const userData = {
      fullName: formData.fullName,
      username: formData.username,
      phone: formData.contactNumber,
      email: formData.emailAddress,
      password: formData.newPassword,
    };

    // console.log(userData);

    try {
      const result = await register(userData).unwrap();
      toast.success(result.message || "Registration successful", {
        description: result.description || "Your account has been created.",
      });
    } catch (error) {
      toast.error(error.data?.message || "Registration failed", {
        description:
          error.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  // Input field configurations
  const personalInfoFields = [
    {
      id: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
    },
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "johndoe",
    },
    {
      id: "contactNumber",
      label: "Contact Number",
      type: "text",
      placeholder: "+1 (555) 000-0000",
    },
    {
      id: "emailAddress",
      label: "Email Address",
      type: "email",
      placeholder: "john@example.com",
    },
  ];

  const passwordFields = [
    {
      id: "newPassword",
      label: "Password",
      type: "password",
      placeholder: "Create a password",
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your password",
    },
  ];

  const termsLinks = [
    {
      id: "terms",
      path: "/terms",
      label: "Terms of Service",
    },
    {
      id: "privacy",
      path: "/privacy",
      label: "Privacy Policy",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalInfoFields.map((field) => (
          <div className="space-y-2" key={field.id}>
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
      </div>

      {passwordFields.map((field) => (
        <div className="space-y-2" key={field.id}>
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

      <div className="flex space-x-2">
        <Checkbox
          id="agreedToTerms"
          className="mt-0.5"
          checked={formData.agreedToTerms}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, agreedToTerms: checked }))
          }
        />
        <Label htmlFor="agreedToTerms" className="block leading-5">
          I agree to the{" "}
          {termsLinks.map((link, index) => (
            <span key={link.id}>
              <NavLink
                to={link.path}
                className="text-foreground hover:text-accent underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </NavLink>
              {index === 0 && " and "}
            </span>
          ))}
        </Label>
      </div>

      <Button className="w-full" variant="accent" isLoading={isLoading}>
        {isLoading ? "Creating Account..." : "Register"}
      </Button>
    </form>
  );
};

export default Register;
