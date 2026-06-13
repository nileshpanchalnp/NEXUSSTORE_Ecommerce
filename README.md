# Cash Management System

A comprehensive web-based cash management application built with React, TypeScript, and Tailwind CSS. Features role-based access control, inventory tracking, financial transaction management, and comprehensive reporting.

## Features

### Authentication & Authorization
- Email/password authentication
- Three user roles: Admin, Manager, Staff
- Role-based permissions for all modules
- Protected routes based on user permissions

### Dashboard
- Real-time business statistics (Total Cash, Purchase, Expense, Profit)
- 7-day transaction overview chart
- Low stock alerts

### Transaction Management
- **Cash Entry**: Record sales transactions with automatic stock deduction
- **Purchase Entry**: Track purchases with automatic stock updates
- **Expense Entry**: Manage business expenses by category

### Inventory
- Real-time stock tracking
- Low stock alerts
- Stock value calculations
- Automatic updates from sales and purchases

### Reporting
- Generate reports: Sales, Purchase, Profit & Loss, Expenses
- Export to CSV format
- Filter by date range (Daily, Weekly, Monthly, Yearly, Custom)

### Administration
- **User Management**: Create, edit, and manage users
- **Permissions**: Configure role-based access control
- Granular permissions (View, Add, Edit, Delete) per module

### UI/UX Features
- Fully responsive design (Mobile, Tablet, Desktop)
- Dark mode support
- Clean, modern interface
- Smooth transitions and animations

## Demo Credentials

All demo accounts use the password: `password123`

- **Admin**: admin@cashmanagement.com
  - Full access to all features

- **Manager**: manager@cashmanagement.com
  - Access to all modules except Permissions and User Management
  - Cannot delete entries

- **Staff**: staff@cashmanagement.com
  - Limited to viewing and adding transactions
  - No access to administrative features

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Storage**: LocalStorage (for demo purposes)

## Getting Started

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components (Layout)
├── contexts/           # React contexts (Auth, Theme)
├── pages/              # Application pages
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── CashEntry.tsx
│   ├── PurchaseEntry.tsx
│   ├── ExpenseEntry.tsx
│   ├── StockManagement.tsx
│   ├── Entries.tsx
│   ├── Reports.tsx
│   ├── Permissions.tsx
│   └── UserManagement.tsx
├── services/           # API and storage services
│   ├── api.ts
│   └── storage.ts
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## Features by Role

### Admin
- Full CRUD operations on all modules
- User management
- Permission configuration
- Complete system access

### Manager
- View and manage transactions
- View reports
- View stock and users
- Limited delete permissions

### Staff
- Add transactions (Cash, Purchase, Expense)
- View dashboard and stock
- View entries
- No administrative access

## Notes

This is a demonstration application using LocalStorage for data persistence. In a production environment, you would:

1. Replace the mock API with a real backend (Node.js/Express, etc.)
2. Use a proper database (PostgreSQL, MongoDB)
3. Implement secure authentication with JWT tokens
4. Add server-side validation and security measures
5. Implement proper error handling and logging
