import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/api/authApi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    contact_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [register, { isLoading }] = useRegisterMutation();

  // State to show/hide password requirements
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const canRegister = formData.agreedToTerms && !isLoading;

  const passwordValidations = {
    minLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*_]/.test(formData.password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    // Prepare data for API
    const userData = {
      name: formData.name,
      username: formData.username,
      contact_number: formData.contact_number,
      email: formData.email,
      password: formData.password,
    };

    try {
      const result = await register(userData).unwrap();

      toast.success(result.message || "Registration successful!");

      // Clear form after successful registration
      setFormData({
        name: "",
        username: "",
        contact_number: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreedToTerms: false,
      });
    } catch (error) {
      toast.error(error.data?.message || "Registration failed");
    }
  };

  // Password requirements display component with real-time validation
  const PasswordRequirements = () => (
    <div className="mt-2 p-3 bg-muted rounded-md space-y-2">
      <p className="text-sm font-medium text-foreground">
        Password Requirements:
      </p>
      <div className="space-y-1">
        {Object.entries({
          minLength: "At least 6 characters",
          hasUppercase: "One uppercase letter (A-Z)",
          hasLowercase: "One lowercase letter (a-z)",
          hasNumber: "One number (0-9)",
          hasSpecialChar: "One special character (!@#$%^&*_)",
        }).map(([key, requirement]) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            {passwordValidations[key] ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            <span
              className={
                passwordValidations[key] ? "text-green-600" : "text-red-600"
              }
            >
              {requirement}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Input field configurations
  const personalInfoFields = [
    {
      id: "name",
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
      id: "contact_number",
      label: "Contact Number",
      type: "text",
      placeholder: "+1 (555) 000-0000",
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@example.com",
    },
  ];

  const passwordFields = [
    {
      id: "password",
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
      path: "/terms-of-use",
      label: "Terms of Use",
    },
    {
      id: "privacy",
      path: "/privacy-policy",
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
            onFocus={() => {
              if (field.id === "password") {
                setShowPasswordRequirements(true);
              }
            }}
            onBlur={() => {
              if (field.id === "password" && !formData.password) {
                setShowPasswordRequirements(false);
              }
            }}
            required
          />
          {field.id === "password" && showPasswordRequirements && (
            <PasswordRequirements />
          )}
        </div>
      ))}

      <div className="flex space-x-2">
        <Checkbox
          id="agreedToTerms"
          className="mt-0.5"
          checked={formData.agreedToTerms}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              agreedToTerms: checked === true,
            }))
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

      <Button
        className="w-full"
        variant="accent"
        isLoading={isLoading}
        type="submit"
        disabled={!canRegister}
      >
        {isLoading ? "Creating Account..." : "Register"}
      </Button>
    </form>
  );
};

export default Register;
