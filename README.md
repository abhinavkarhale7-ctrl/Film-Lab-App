# Eternus Film Lab Management App

A modern web application for managing film processing orders, customer communications, and business operations.

## Tech Stack

- **Frontend:** Next.js 16 with TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Forms:** React Hook Form with Zod validation

## Features

### MVP (Phase 1)
- ✅ Customer registration and login
- ✅ Basic order form submission
- ✅ Admin dashboard to view and update orders
- ✅ Email notifications (order received, ready for pickup)
- ✅ Simple payment integration
- ✅ File upload for scans
- ✅ Order status tracking

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Film-Lab-App
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_URL` - Your application URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`

4. Set up the database:
```bash
npx prisma migrate dev --name init
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

This will create:
- Admin user: `admin@eternusfilmlab.com` / `admin123`
- Demo customer: `customer@example.com` / `customer123`
- Sample services with pricing

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Credentials

After seeding the database, you can use these credentials:

- **Admin**: `admin@eternusfilmlab.com` / `admin123`
- **Customer**: `customer@example.com` / `customer123`

## Database Schema

The application uses the following main models:

- **User** - Customer and admin accounts
- **Order** - Film processing orders
- **OrderItem** - Line items for each order
- **Scan** - Digital scan files
- **Payment** - Payment records
- **Service** - Available services and pricing

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── dashboard/         # Customer dashboard
│   ├── orders/            # Order management
│   └── admin/             # Admin panel
├── components/            # React components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # NextAuth configuration
└── types/                 # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for a complete list of required environment variables.

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret for JWT signing

### Optional
- `STRIPE_SECRET_KEY` - Stripe payment integration
- `EMAIL_SERVER_HOST` - SMTP server for emails
- `AWS_S3_BUCKET` - S3 bucket for file storage

## Development

### Database Migrations

When you make changes to the Prisma schema:

```bash
npx prisma migrate dev --name <migration-name>
```

### Prisma Studio

To view and edit your database:

```bash
npx prisma studio
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The app can be deployed to any Node.js hosting platform:
- Railway
- Render
- AWS
- DigitalOcean

Make sure to:
1. Set all environment variables
2. Run database migrations
3. Build the application

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control (RBAC)
- Input validation with Zod
- CORS configuration
- Rate limiting (to be implemented)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
