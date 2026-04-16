# Tomato Disease Detection - Frontend

A modern, responsive Next.js 14 application with TypeScript and shadcn/ui for detecting tomato plant diseases using AI.

## Features

- 🎨 **Modern UI** - Built with Next.js 14, TypeScript, and Tailwind CSS
- 🎭 **shadcn/ui Components** - Beautiful, accessible component library
- 📸 **Drag & Drop Upload** - Easy image upload with preview
- 🔬 **Disease Detection** - AI-powered analysis of 10 disease types
- 📚 **Comprehensive Information** - Detailed symptoms, causes, treatment, and prevention
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Responsive Design** - Works perfectly on all devices

## Detected Diseases

1. **Bacterial Spot**
2. **Early Blight**
3. **Late Blight**
4. **Leaf Mold**
5. **Septoria Leaf Spot**
6. **Two-Spotted Spider Mite**
7. **Target Spot**
8. **Tomato Yellow Leaf Curl Virus**
9. **Tomato Mosaic Virus**
10. **Healthy Plant**

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend Flask server running on `http://localhost:5001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. The `.env.local` file is already configured:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload an Image**: Drag and drop or click to browse for a tomato leaf image
2. **Analyze**: Click the "Analyze Image" button
3. **View Results**: Get instant disease detection with detailed information
4. **Learn More**: Explore symptoms, causes, treatment options, and prevention strategies

## Project Structure

```
tomato-disease-frontend/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── image-upload.tsx      # Image upload component
│   └── disease-info-display.tsx # Disease information display
├── lib/
│   ├── api.ts               # Backend API integration
│   ├── disease-data.ts      # Disease information database
│   └── utils.ts             # Utility functions
└── public/                   # Static assets
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks

## Backend Integration

The frontend connects to a Flask backend API running on `localhost:5001`. Ensure the backend server is running before using the application.

### API Endpoints Used

- `POST /predict` - Upload image and get disease prediction
- `GET /` - Health check

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Customization

### Change API URL

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://your-backend-url:port
```

### Modify Disease Data

Edit `lib/disease-data.ts` to add or modify disease information.

### Customize Theme

Edit `app/globals.css` to change colors and theme variables.

## License

This project is open source and available under the MIT License.

## Author

Tomato Disease Detection System - AI-Powered Plant Health Analysis

