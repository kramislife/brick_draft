import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { Dialog } from "@/components/ui/dialog";
import AuthDialog from "./AuthDialog";

const ResetPassword = () => {
  const { token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const passwordValidations = {
    minLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*_]/.test(formData.password),
  };

  const canReset =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    Object.values(passwordValidations).every(Boolean) &&
    !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (!Object.values(passwordValidations).every(Boolean)) {
      toast.error("Please ensure your password meets all requirements");
      return;
    }
    try {
      const result = await resetPassword({
        token,
        passwordData: {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
      }).unwrap();
      toast.success(result.message || "Password reset successful!", {
        description:
          result.description || "You can now log in with your new password.",
      });
      setIsAuthDialogOpen(true);
    } catch (error) {
      toast.error(error.data?.message || "Password reset failed", {
        description:
          error.data?.description ||
          "Please try again or request a new reset link.",
      });
    }
  };

  const handleLoginRedirect = () => {
    setIsAuthDialogOpen(true);
  };
  const handleCloseAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };

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

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-28 px-5">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-red-600">
                Invalid Reset Link
              </CardTitle>
              <CardDescription>
                The password reset link is invalid or missing. Please request a
                new password reset.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleLoginRedirect}
                className="w-full"
                variant="accent"
              >
                Sign in here
              </Button>
              <Dialog
                open={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
              >
                <AuthDialog onClose={handleCloseAuthDialog} />
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-28 px-5">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Reset Your Password
              </CardTitle>
              <CardDescription>
                Enter your new password below. Make sure it meets all the
                security requirements.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setShowPasswordRequirements(true)}
                    onBlur={() => {
                      if (!formData.password) {
                        setShowPasswordRequirements(false);
                      }
                    }}
                    required
                  />
                  {showPasswordRequirements && <PasswordRequirements />}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-sm text-red-600">
                        Passwords don't match
                      </p>
                    )}
                </div>

                <Button
                  variant="accent"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={!canReset}
                  type="submit"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>

              <div className="text-center pt-5 border-t">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Button
                    variant="link"
                    className="text-blue-600 dark:text-accent p-0 h-auto font-semibold"
                    onClick={handleLoginRedirect}
                  >
                    Sign in here
                  </Button>
                </p>
                <Dialog
                  open={isAuthDialogOpen}
                  onOpenChange={setIsAuthDialogOpen}
                >
                  <AuthDialog onClose={handleCloseAuthDialog} />
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
