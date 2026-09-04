## Why VoiceLingo Was Built

VoiceLingo isn't just an English practice app — it was built with resource-efficient, environmentally-conscious engineering in mind. Most apps hoard user data indefinitely, which drives up unnecessary storage and energy use in data centers. VoiceLingo was deliberately designed to move away from that:

- Session data auto-deletes after 30 days via a MongoDB TTL index, so the database never accumulates unnecessary data
- Users can also manually delete any session at any time — data control stays in the user's hands
- Only what's genuinely needed long-term (overall progress, weak-area patterns) is kept permanently; everything else is temporary

Alongside this, the core goals are:
- Creating a judgment-free space for Bangladeshi students to practice spoken English
- Real back-and-forth voice conversation, not just text-based exercises
- Concrete feedback (score, weak areas) after every session so students know exactly what to improve

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
