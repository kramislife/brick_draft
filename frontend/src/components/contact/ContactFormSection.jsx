import React, { useState } from "react";
import { motion } from "motion/react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useContactUsMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

const ContactFormSection = ({ data, animations }) => {
  const [contactUs, { isLoading }] = useContactUsMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await contactUs(formData).unwrap();
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to send message. Please try again."
      );
    }
  };

  return (
    <motion.div className="lg:col-span-2" {...animations}>
      <Card>
        <CardHeader className="text-xl font-semibold">
          {data.title}
          <p className="text-sm text-muted-foreground font-normal">
            {data.subtitle}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.fields.map((field) => (
                <div key={field.id} className={`space-y-2 ${field.gridSpan}`}>
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.id] || ""}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor={data.messageField.id}>
                {data.messageField.label}
              </Label>
              <Textarea
                id={data.messageField.id}
                placeholder={data.messageField.placeholder}
                className="min-h-[200px]"
                required={data.messageField.required}
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              className="w-full"
              disabled={isLoading}
            >
              <Send />
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactFormSection;
