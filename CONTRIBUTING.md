# Contributing to Film Lab Management App

Thank you for your interest in contributing to the Eternus Film Lab Management App!

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Film-Lab-App.git`
3. Install dependencies: `npm install`
4. Set up environment variables (copy `.env.example` to `.env`)
5. Run migrations: `npx prisma migrate dev`
6. Seed database: `npm run db:seed`
7. Start dev server: `npm run dev`

## Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for linting
- **Prettier** (optional but recommended)

Run linter before committing:
```bash
npm run lint
```

## Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/bug-description`

## Commit Messages

Use clear, descriptive commit messages:

- ✅ Good: "Add order status filter to admin dashboard"
- ❌ Bad: "Update admin page"

Follow conventional commits format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all tests pass (when tests are added)
4. Update documentation if needed
5. Submit PR with clear description of changes
6. Request review from maintainers
7. Address any feedback
8. Once approved, PR will be merged

## Testing

Before submitting a PR:

1. Test all affected features manually
2. Ensure build succeeds: `npm run build`
3. Check for TypeScript errors: `npm run lint`
4. Test in different browsers (Chrome, Firefox, Safari)
5. Test responsive design on mobile

## Code Review Guidelines

When reviewing PRs:

- Be constructive and respectful
- Focus on code quality, not personal preferences
- Suggest improvements with examples
- Approve if changes are good enough, perfection is not required

## Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainers directly
3. Include detailed description of the vulnerability
4. We'll respond within 48 hours

## Questions?

- Check existing issues
- Read documentation (README.md, API.md, DEPLOYMENT.md)
- Open a discussion or issue

## License

By contributing, you agree that your contributions will be licensed under the ISC License.
