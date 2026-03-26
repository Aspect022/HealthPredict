# HealthPredict Frontend 🎨

The frontend for HealthPredict is a modern, responsive web application built with **Next.js 15** and **React 19**, featuring a beautiful UI powered by **TailwindCSS** and **shadcn/ui** components.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Styling](#styling)
- [State Management](#state-management)
- [Development](#development)

## 🎯 Overview

The frontend provides an intuitive and accessible interface for users to:
- Interact with health prediction models
- Manage their user accounts
- Upload and analyze medical documents
- Chat with an AI health assistant
- Visualize health data and predictions

## 🛠️ Tech Stack

### Core Framework
- **Next.js**: 15.2.4 (React Framework with App Router)
- **React**: 19 (UI Library)
- **TypeScript**: 5+ (Type Safety)

### Styling
- **TailwindCSS**: 3.4+ (Utility-first CSS)
- **tailwindcss-animate**: Animations
- **class-variance-authority**: Component variants
- **tailwind-merge**: Class merging utility
- **clsx**: Conditional class names

### UI Components
- **Radix UI**: Headless UI primitives
  - Accordion, Alert Dialog, Avatar, Checkbox
  - Context Menu, Dialog, Dropdown Menu
  - Hover Card, Label, Menubar, Navigation Menu
  - Popover, Progress, Radio Group, Scroll Area
  - Select, Separator, Slider, Switch, Tabs
  - Toast, Toggle, Tooltip, and more
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Recharts**: Data visualization and charts

### Forms & Validation
- **React Hook Form**: 7.54+ (Form state management)
- **Zod**: 3.24+ (Schema validation)
- **@hookform/resolvers**: Form validation integration

### Additional Features
- **next-themes**: Theme switching (dark/light mode)
- **Sonner**: Toast notifications
- **Embla Carousel**: Carousel/slider component
- **date-fns**: Date manipulation
- **react-day-picker**: Date picker component
- **MongoDB**: Database integration (for chat history)

## 📁 Project Structure

```
Frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page (disease cards)
│   ├── globals.css              # Global styles
│   │
│   ├── login/                   # Authentication pages
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   │
│   ├── diabetes/                # Disease prediction pages
│   │   └── page.tsx
│   ├── heart/
│   │   └── page.tsx
│   ├── depression/
│   │   └── page.tsx
│   ├── stroke/
│   │   └── page.tsx
│   ├── parkinsons/
│   │   └── page.tsx
│   ├── thyroid/
│   │   └── page.tsx
│   ├── hepatitis/
│   │   └── page.tsx
│   ├── kidney/
│   │   └── page.tsx
│   │
│   ├── ai-assistant/            # AI chatbot page
│   │   └── page.tsx
│   └── FileUploadPage/          # Medical document analysis
│       └── page.tsx
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   └── ... (40+ components)
│   │
│   ├── navbar.tsx               # Navigation bar
│   ├── theme-toggle.tsx         # Dark/light mode toggle
│   ├── floating-chat.tsx        # Floating chat widget
│   ├── auth-alert.tsx           # Authentication alerts
│   └── theme-provider.tsx       # Theme context provider
│
├── context/                      # React Context providers
│   └── auth-context.tsx         # Authentication context
│
├── hooks/                        # Custom React hooks
│   └── use-toast.ts             # Toast notification hook
│
├── lib/                          # Utility functions
│   └── utils.ts                 # Helper utilities
│
├── types/                        # TypeScript type definitions
│   └── chat.ts                  # Chat message types
│
├── public/                       # Static assets
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   └── placeholder.svg
│
├── styles/                       # Additional styles
│   └── globals.css              # Global CSS variables
│
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn/ui configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 📦 Installation

### Prerequisites

- **Node.js**: 18.0 or higher
- **npm** or **pnpm**: Latest version
- **Backend API**: Running at `http://localhost:8000`

### Setup Steps

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies using npm
npm install

# OR using pnpm (faster)
pnpm install

# OR using yarn
yarn install
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the Frontend directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional: MongoDB connection for chat history
MONGODB_URI=mongodb://localhost:27017/healthpredict

# Optional: Additional configuration
NEXT_PUBLIC_APP_NAME=HealthPredict
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### shadcn/ui Configuration

The project is pre-configured with shadcn/ui components. Configuration is in `components.json`:

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 🚀 Running the Application

### Development Server

```bash
# Start development server
npm run dev

# OR with pnpm
pnpm dev

# OR with yarn
yarn dev
```

The application will be available at: **http://localhost:3000**

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## ✨ Features

### 🔐 Authentication
- **User Registration**: Secure signup with form validation
- **User Login**: Email/password authentication
- **Password Recovery**: Forgot password functionality
- **Protected Routes**: Authorization checks for authenticated pages
- **Profile Management**: View and manage user profile

### 🏥 Disease Prediction
Eight comprehensive prediction modules:
1. **Diabetes**: 8-field form with glucose, BMI, blood pressure metrics
2. **Heart Disease**: 12-field cardiovascular assessment
3. **Depression**: 13-field student mental health evaluation
4. **Stroke**: 10-field stroke risk assessment
5. **Parkinson's**: 58-field comprehensive neurological assessment
6. **Thyroid**: 21-field thyroid hormone analysis
7. **Hepatitis**: 11-field liver function evaluation
8. **Kidney Disease**: 24-field renal health assessment

Each prediction page includes:
- Interactive form with real-time validation
- Clear field descriptions and units
- Risk result display (High Risk/Low Risk)
- User-friendly error handling
- Responsive design

### 🤖 AI Assistant
- **Floating Chat Widget**: Always accessible from any page
- **Conversational AI**: Health-related questions and guidance
- **Chat History**: Persistent conversation storage
- **Context-Aware**: Understands health terminology

### 📄 Document Analysis
- **PDF Upload**: Medical document upload interface
- **AI Analysis**: Powered by Google Gemini AI
- **Detailed Reports**: Comprehensive document insights
- **Diagnosis Extraction**: Automatic extraction of key information

### 🎨 UI/UX Features
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Mobile-first approach, works on all devices
- **Accessibility**: WCAG 2.1 compliant components
- **Smooth Animations**: Framer Motion and Tailwind animations
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback for actions
- **Error Boundaries**: Graceful error handling

## 🗺️ Pages & Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Home page with disease cards |
| `/login` | `app/login/page.tsx` | User login |
| `/signup` | `app/signup/page.tsx` | User registration |
| `/forgot-password` | `app/forgot-password/page.tsx` | Password recovery |

### Protected Routes (Require Authentication)
| Route | Component | Description |
|-------|-----------|-------------|
| `/profile` | `app/profile/page.tsx` | User profile |
| `/diabetes` | `app/diabetes/page.tsx` | Diabetes prediction |
| `/heart` | `app/heart/page.tsx` | Heart disease prediction |
| `/depression` | `app/depression/page.tsx` | Depression detection |
| `/stroke` | `app/stroke/page.tsx` | Stroke prediction |
| `/parkinsons` | `app/parkinsons/page.tsx` | Parkinson's prediction |
| `/thyroid` | `app/thyroid/page.tsx` | Thyroid prediction |
| `/hepatitis` | `app/hepatitis/page.tsx` | Hepatitis prediction |
| `/kidney` | `app/kidney/page.tsx` | Kidney disease prediction |
| `/ai-assistant` | `app/ai-assistant/page.tsx` | AI health chatbot |
| `/FileUploadPage` | `app/FileUploadPage/page.tsx` | Medical document analysis |

## 🧩 Components

### Core Components

#### Navbar (`components/navbar.tsx`)
- Responsive navigation bar
- User authentication status display
- Theme toggle integration
- Mobile menu support

#### Theme Toggle (`components/theme-toggle.tsx`)
- Switch between light and dark themes
- Persists user preference
- Smooth transitions

#### Floating Chat (`components/floating-chat.tsx`)
- Always-visible chat button
- Expandable chat interface
- Real-time messaging
- Chat history

#### Auth Alert (`components/auth-alert.tsx`)
- Authentication status notifications
- Login/logout confirmations
- Error messages

### UI Components (shadcn/ui)

40+ pre-built, accessible components in `components/ui/`:

**Form Components:**
- `button.tsx` - Customizable buttons with variants
- `input.tsx` - Text input fields
- `select.tsx` - Dropdown selects
- `checkbox.tsx` - Checkboxes
- `radio-group.tsx` - Radio buttons
- `slider.tsx` - Range sliders
- `switch.tsx` - Toggle switches
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form labels

**Layout Components:**
- `card.tsx` - Content cards
- `separator.tsx` - Visual dividers
- `scroll-area.tsx` - Scrollable containers
- `tabs.tsx` - Tabbed interfaces
- `accordion.tsx` - Expandable sections

**Feedback Components:**
- `toast.tsx` - Toast notifications
- `alert-dialog.tsx` - Confirmation dialogs
- `dialog.tsx` - Modal dialogs
- `progress.tsx` - Progress bars
- `skeleton.tsx` - Loading skeletons

**Navigation Components:**
- `dropdown-menu.tsx` - Dropdown menus
- `navigation-menu.tsx` - Navigation bars
- `menubar.tsx` - Menu bars
- `breadcrumb.tsx` - Breadcrumb navigation
- `pagination.tsx` - Page navigation

**Data Display:**
- `table.tsx` - Data tables
- `chart.tsx` - Charts (with Recharts)
- `avatar.tsx` - User avatars
- `badge.tsx` - Status badges

**Overlay Components:**
- `popover.tsx` - Popovers
- `tooltip.tsx` - Tooltips
- `hover-card.tsx` - Hover cards
- `sheet.tsx` - Side sheets
- `drawer.tsx` - Drawers

## 🎨 Styling

### TailwindCSS Configuration

The project uses a custom Tailwind configuration with:
- **CSS Variables**: Theme colors defined as HSL variables
- **Dark Mode**: Class-based dark mode support
- **Custom Colors**: Primary, secondary, accent, muted palettes
- **Custom Animations**: Accordion, fade, slide animations
- **Responsive Breakpoints**: Mobile-first design

### Global Styles

Defined in `app/globals.css`:
- CSS custom properties for theming
- Base styles for typography
- Utility classes
- Component-specific styles

### Component Styling

Components use:
- **Tailwind utility classes** for rapid styling
- **CVA (class-variance-authority)** for variant management
- **clsx** and **tailwind-merge** for conditional classes

Example:
```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
  }
)
```

## 📊 State Management

### React Context

#### AuthContext (`context/auth-context.tsx`)
Manages user authentication state:
```tsx
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (userData: SignupData) => Promise<void>
  isAuthenticated: boolean
  loading: boolean
}
```

Usage:
```tsx
import { useAuth } from "@/context/auth-context"

function Component() {
  const { user, login, logout, isAuthenticated } = useAuth()
  // ...
}
```

### Form State

Forms use **React Hook Form** with **Zod** validation:
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  const onSubmit = (data) => {
    // Handle submission
  }
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
}
```

## 🔧 Development

### Adding New Pages

1. Create page file in `app/` directory:
```tsx
// app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page Content</div>
}
```

2. Add route to navbar if needed
3. Implement authentication if required

### Adding New Components

1. Create component file in `components/`:
```tsx
// components/my-component.tsx
export function MyComponent() {
  return <div>Component</div>
}
```

2. Export from component file
3. Import and use in pages

### Adding shadcn/ui Components

```bash
# Add new shadcn/ui component
npx shadcn-ui@latest add [component-name]

# Example: Add form component
npx shadcn-ui@latest add form
```

### API Integration

API calls use the Fetch API:
```tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL

async function predictDisease(diseaseType: string, data: any) {
  const response = await fetch(`${API_URL}/predict/${diseaseType}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Prediction failed')
  }
  
  return response.json()
}
```

### TypeScript Types

Define types in `types/` directory:
```tsx
// types/prediction.ts
export interface PredictionRequest {
  [key: string]: string | number
}

export interface PredictionResponse {
  disease: string
  prediction: number
  risk_status: "High Risk" | "Low Risk"
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1400px

All components are tested across devices for optimal user experience.

## ♿ Accessibility

- **Semantic HTML**: Proper use of HTML5 elements
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliance
- **Alt Text**: Images have descriptive alt text

## 🚀 Performance Optimization

- **Next.js App Router**: Automatic code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Bundle Analysis**: Webpack bundle analyzer

## 🐛 Common Issues & Troubleshooting

### Module Not Found
```
Error: Cannot find module '@/components/ui/button'
```
**Solution**: Check TypeScript path aliases in `tsconfig.json`

### Hydration Errors
```
Error: Hydration failed because the initial UI does not match
```
**Solution**: Ensure server and client render the same content. Use `suppressHydrationWarning` for theme.

### API Connection Issues
```
Error: Failed to fetch
```
**Solution**: Verify `NEXT_PUBLIC_API_URL` in `.env.local` and backend is running.

## 📦 Build & Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

### Deployment Platforms

**Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Docker**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

Set these in your deployment platform:
- `NEXT_PUBLIC_API_URL` - Production API URL
- `MONGODB_URI` - Production database URL

## 📝 Scripts

Available npm scripts:
```json
{
  "dev": "next dev",              // Development server
  "build": "next build",          // Production build
  "start": "next start",          // Production server
  "lint": "next lint"             // Run ESLint
}
```

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the [main README](../README.md) for general information
- Review Next.js documentation: https://nextjs.org/docs

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Built with ❤️ using modern web technologies**
