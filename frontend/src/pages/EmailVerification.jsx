import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVerifyUserMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import AuthDialog from "@/pages/auth/AuthDialog";

const EmailVerification = () => {
  const { token } = useParams();
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // "verifying", "success", "error"
  const [verificationData, setVerificationData] = useState(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error");
        setVerificationData({
          message: "Invalid verification link",
          description: "The verification link is missing or invalid.",
        });
        return;
      }

      try {
        const result = await verifyUser(token).unwrap();
        setVerificationStatus("success");
        setVerificationData({
          message: result.message,
          description: result.description,
        });

        toast.success(result.message || "Email verification successful!", {
          description: result.description || "Your email has been verified.",
        });
      } catch (error) {
        setVerificationStatus("error");
        setVerificationData({
          message: error.data?.message || "Email verification failed",
        });

        toast.error(error.data?.message || "Email verification failed");
      }
    };

    verifyEmail();
  }, [token, verifyUser]);

  const handleLoginRedirect = () => {
    setIsAuthDialogOpen(true);
  };

  const handleCloseAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };

  if (verificationStatus === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
            <h2 className="mt-5 text-3xl font-bold">Verifying Your Email</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-lg w-full">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-5 text-3xl font-bold">
                {verificationData?.message || "Email Verified Successfully!"}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {verificationData?.description ||
                  "Your email has been verified. You can now log in to your account."}
              </p>
              <div className="mt-5">
                <Button
                  onClick={handleLoginRedirect}
                  className="w-full"
                  variant="accent"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
          <AuthDialog onClose={handleCloseAuthDialog} />
        </Dialog>
      </>
    );
  }

  if (verificationStatus === "error") {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-xl w-full">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-5 text-3xl font-bold">
                {verificationData?.message || "Verification Failed"}
              </h2>
            
              <div className="mt-5">
                <Button
                  onClick={handleLoginRedirect}
                  className="w-full"
                  variant="outline"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
          <AuthDialog onClose={handleCloseAuthDialog} />
        </Dialog>
      </>
    );
  }

  return null;
};

export default EmailVerification;
