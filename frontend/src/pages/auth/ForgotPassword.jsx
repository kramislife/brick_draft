import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuthDialog from "@/pages/auth/AuthDialog";
import { useForgotPasswordMutation } from "@/redux/api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    // console.log(email);

    try {
      const result = await forgotPassword({ email }).unwrap();
      toast.success(result?.message || "Email sent", {
        description:
          result?.description ||
          "If an account exists with this email, you'll receive password reset instructions.",
      });
    } catch (error) {
      toast.error(error.data?.message || "Request failed", {
        description:
          error.data?.description || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-28 px-5">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Reset Your Password
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset
              your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                variant="accent"
                className="w-full"
                isLoading={isLoading}
                disabled={!email}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            <div className="text-center pt-5 border-t">
              <p className="text-sm">
                Remember your password?{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-blue-600 dark:text-accent p-0 h-auto font-semibold"
                    >
                      Sign in here
                    </Button>
                  </DialogTrigger>
                  <AuthDialog />
                </Dialog>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
