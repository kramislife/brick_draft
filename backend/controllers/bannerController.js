import catchAsyncErrors from "../utills/custom_error_handler.js";
import Banner from "../models/banner.model.js";

// GET ALL BANNERS
export const getAllBanners = catchAsyncErrors(async (req, res) => {
  const banners = await Banner.find().sort({ order: 1 });

  res.status(200).json({
    success: true,
    message: "Banners fetchedw successfully",
    banners,
  });
});

// CREATE NEW BANNER
export const createBanner = catchAsyncErrors(async (req, res, next) => {
  const imageFile = req.body.image;

  if (!imageFile) {
    return next(new ErrorHandler("Please upload an image", 400));
  }

  // UPLOAD IMAGE TO CLOUDINARY
  const uploadedImage = await uploadImage(imageFile, "brick_draft/banners");

  const banner = await Banner.create({
    image: {
      public_id: uploadedImage.public_id,
      url: uploadedImage.url,
    },
    created_by: req.user.user_id,
  });

  res.status(201).json({
    success: true,
    message: "Banner created successfully",
    banner,
  });
});

// UPDATE BANNER
export const updateBanner = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const imageFile = req.body.image;

  let banner = await Banner.findById(id);
  if (!banner) {
    return next(new ErrorHandler("Banner not found", 404));
  }

  const updateData = {
    isActive,
    updated_by: req.user.user_id,
  };

  if (imageFile) {
    // Delete old image and upload new one
    await deleteImage(banner.image.public_id);
    const uploadedImage = await uploadImage(imageFile, "brick_draft/banners");
    updateData.image = {
      public_id: uploadedImage.public_id,
      url: uploadedImage.url,
    };
  }

  banner = await Banner.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Banner updated successfully",
    banner,
  });
});

// DELETE BANNER
export const deleteBanner = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const banner = await Banner.findById(id);
  if (!banner) {
    return next(new ErrorHandler("Banner not found", 404));
  }

  // Delete image from cloudinary
  await deleteImage(banner.image.public_id);

  // Delete banner from database
  await Banner.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
});
