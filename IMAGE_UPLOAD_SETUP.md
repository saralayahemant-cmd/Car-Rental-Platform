# Image Upload Setup Guide

This guide explains how to set up Cloudinary for image uploads in your Car Rental application.

## What's Installed

✅ **multer** - File upload middleware  
✅ **cloudinary** - Cloud image storage  
✅ **dotenv** - Environment variable management

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a **FREE account** (no credit card required)
3. Verify your email

## Step 2: Get Your Cloudinary Credentials

1. After login, you'll land on the **Dashboard**
2. You'll see your **Cloud Name** displayed prominently
3. Scroll down or click on "API Keys" to find:
   - **API Key**
   - **API Secret**

These are your credentials!

## Step 3: Update .env File

Open the `.env` file in your project root and replace the placeholder values:

```env
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Example:**

```env
CLOUDINARY_NAME=d1234xyz5a
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789
```

## Step 4: Test the Application

1. Start your server: `nodemon app.js`
2. Go to: `http://localhost:3001/host/newcar`
3. Fill in car details
4. **Click "Choose File"** under "Upload Car Image"
5. Select an image from your computer
6. Click "Add Car"
7. Your image will be uploaded to Cloudinary and displayed on the car listing page

## Features Implemented

### 🖼️ **Add New Car**

- File upload field instead of URL input
- Images automatically uploaded to Cloudinary
- Secure cloud storage with fast CDN delivery

### ✏️ **Edit Car**

- Optional image update
- Shows current car image
- Only updates image if a new file is selected

### 📋 **Car Listings**

- Beautiful grid layout
- Car images displayed with details
- Price, condition, seats, and fuel type shown
- Hover effects for better UX

### 📱 **Car Details Page**

- Large high-quality image display
- All car information clearly laid out
- Edit and Delete buttons for car owner
- Responsive design

## File Upload Limits

- **Maximum File Size:** 5 MB
- **Supported Formats:** JPG, PNG, GIF, WebP, TIFF, WEBP, ICO
- **Storage:** Unlimited (Cloudinary Free Plan)
- **Bandwidth:** 25GB/month (Cloudinary Free Plan)

## Cloudinary Free Plan Limits

- ✅ Up to 25 GB storage
- ✅ Up to 25 GB bandwidth per month
- ✅ 300,000 transformations per month
- ✅ Auto-optimization
- Perfect for a small car rental application

## Troubleshooting

### Images not uploading?

1. Check that `.env` file has correct credentials
2. Verify internet connection
3. Check file size (must be under 5MB)
4. Ensure file is an image format

### "Cannot find module 'dotenv'"

Run: `npm install dotenv`

### "CloudinaryStorage is not defined"

This is normal - we're using the Cloudinary API directly, not multer-storage-cloudinary

### Images showing 404?

1. Wait a few seconds (first upload takes time to process)
2. Refresh the page
3. Check that Cloudinary credentials are correct

## Security Notes

⚠️ **Important:**

- Never commit `.env` file to version control
- Add `.env` to `.gitignore` (already should be)
- Keep your API Secret confidential
- Use environment variables in production

## API Reference

The image upload is handled by:

- **Multer Configuration:** `init/multerconfig.js`
- **Cloudinary Config:** `init/cloudinaryconfig.js`
- **Controller:** `controllers/hostcontroller.js`

Check these files if you need to customize upload behavior.
