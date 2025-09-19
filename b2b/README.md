# B2B Platform - Next.js Application

A modern B2B platform built with Next.js, shadcn/ui, and Framer Motion, designed for business-to-business operations and enterprise solutions.

## 🚀 Features

- **Modern UI/UX**: Built with shadcn/ui components for a professional look
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **TypeScript**: Full TypeScript support for type safety
- **Dashboard**: Interactive business dashboard with stats and metrics
- **Landing Page**: Professional landing page with testimonials and features

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Modern UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Modern icon library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd b2b
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
b2b/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   └── Navigation.tsx        # Navigation component
│   └── lib/
│       └── utils.ts              # Utility functions
├── components.json               # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🎨 Key Components

### Landing Page Features
- Hero section with animated elements
- Feature showcase with cards
- Customer testimonials
- Call-to-action sections
- Professional footer

### Dashboard Features
- Real-time statistics cards
- Revenue and performance charts (placeholders)
- Recent activity feed
- Quick action buttons
- System status indicators

### UI Components (shadcn/ui)
- Button variations
- Card layouts
- Badges and avatars
- Input fields with labels

## 🎭 Animations

The application uses Framer Motion for various animations:

- **Page Transitions**: Smooth entry animations
- **Stagger Animations**: Sequential element reveals
- **Hover Effects**: Interactive button and card effects
- **Scroll Animations**: Elements animate into view on scroll

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for medium screens
- **Desktop**: Full-featured desktop experience
- **Breakpoints**: sm, md, lg, xl responsive breakpoints

## 🎯 Pages

### Home Page (`/`)
Professional landing page featuring:
- Hero section with animated call-to-action
- Features grid with icons and descriptions
- Customer testimonials carousel
- Newsletter signup and contact forms

### Dashboard (`/dashboard`)
Business intelligence dashboard with:
- Key performance indicators (KPIs)
- Revenue charts and analytics
- Recent activity timeline
- Quick action shortcuts
- System health monitoring

## 🔧 Customization

### Colors
The application uses a professional color scheme:
- Primary: Blue (#2563eb)
- Secondary: Gray shades
- Success: Green
- Warning: Yellow
- Error: Red

### Typography
- Font: Inter (system font stack)
- Headings: Bold weights (600-900)
- Body: Regular weight (400)
- Small text: Medium weight (500)

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npx vercel
```

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [shadcn](https://ui.shadcn.com/) for the beautiful UI components
- [Framer](https://www.framer.com/motion/) for the animation library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

**Built with ❤️ for B2B businesses**
