# 📅 Event Management System

A modern and modular event management platform that allows users to organize, manage, and track events within multiple calendars. Built with a React frontend, Zustand for state management, and a REST API backend (e.g. Django).

---

## ✨ Features

### 🔐 Authentication

- Secure login and user-specific data access
- Token-based API communication

### 🗓️ Calendar Management

- Create, update, delete calendars
- Link events to specific calendars

### 📌 Event Management

- Create, edit, delete, and view events
- Filter events by calendar
- Retrieve individual event details
- Support for recurrence, time range, color tagging, and more

### ⚙️ State Management

- Fast and predictable state using Zustand
- Local state caching for performance

### 🌐 API Integration

- Clean async actions for CRUD operations
- Axios-based HTTP client

### 🧪 Error Handling

- Graceful error display and logging
- Centralized error state per feature

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v18+)
- pnpm (or npm/yarn)
- Backend API running (e.g. Django with REST endpoints for `/events`, `/calendars`)

---

### 🔧 Installation

```bash
pnpm install
```

### ▶️ Running the App

```bash
pnpm dev
```

### 🏗️ Build for Production

```bash
pnpm build
```
