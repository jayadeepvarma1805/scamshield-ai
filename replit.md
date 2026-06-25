# ScamShield - AI Threat Analysis Platform

## Overview

ScamShield is an AI-powered scam detection and threat analysis web application. It allows users to scan URLs for potential security threats including phishing, malware, fraud, and other cyber risks. The platform provides real-time threat analysis using AI models and displays risk scores, threat classifications, and detailed security summaries.

Key features:
- URL scanning with AI-powered threat detection
- Risk score visualization with color-coded gauges
- Threat type classification (phishing, malware, scam, fraud, etc.)
- Scam reporting system for community-driven threat database
- Recent threats feed with search functionality

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom dark theme design system
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **State Management**: TanStack React Query for server state
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation

The frontend follows a component-based architecture with:
- Pages in `src/pages/` (Index, NotFound)
- Reusable components in `src/components/` (UrlScanner, ThreatFeed, etc.)
- UI primitives in `src/components/ui/` (shadcn components)
- Shared utilities in `src/lib/` (API client, utils)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **API Design**: RESTful endpoints under `/api/`
- **Storage**: In-memory storage (MemStorage class) with interface for future database integration

Key API endpoints:
- `POST /api/ai/analyze-url` - Analyzes URLs for threats using AI (currently mocked)
- `POST /api/report` - Submit scam reports
- `GET /api/reports/recent` - Fetch recent threat reports
- `GET /api/reports/search` - Search threat database

### Data Schema
Uses Drizzle ORM with PostgreSQL schema definitions (database not yet connected):
- `threat_analysis` - Stores URL scan results with risk scores, threat types, and AI analysis
- `reports` - User-submitted scam reports with categorization

### Design System
Dark-themed cybersecurity aesthetic with:
- HSL-based color variables
- Threat level color coding (critical=red, high=orange, medium=yellow, low=green, safe=cyan)
- JetBrains Mono for code/technical text, Inter for UI text
- Glow effects for emphasis

## External Dependencies

### AI Integration
- **Gemini AI**: Referenced in API documentation for URL analysis (currently mocked in implementation)
- Backend expects integration with `gemini-1.5-pro` model

### Frontend Libraries
- `@tanstack/react-query` - Data fetching and caching
- `react-hook-form` + `zod` - Form handling and validation
- `date-fns` - Date formatting
- `lucide-react` - Icon library
- `sonner` - Toast notifications
- `embla-carousel-react` - Carousel component
- `recharts` - Charting library

### Backend Libraries
- `express` - Web server framework
- `drizzle-orm` + `drizzle-zod` - ORM and schema validation
- `zod` - Runtime type validation

### Database
- Schema defined for PostgreSQL via Drizzle ORM
- Currently using in-memory storage (`MemStorage`)
- Ready for PostgreSQL connection when database is provisioned

### External Services (Referenced)
- Separate backend service expected at `http://localhost:4000` (per attached API docs)
- MongoDB mentioned in external API docs for storing analysis results