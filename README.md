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

## Booking form

`/catalog/[camperId]` uses `BookingForm` and the existing Axios client with a
TanStack Query mutation. The request contains only trimmed `name` and `email`.
A successful response displays the API's confirmation message and clears the
fields. Failures preserve the values; POST requests are never retried automatically.

Design checked against this project's Figma copy:
[Details form](https://www.figma.com/design/3hU2HtLFsqHRVtStDTKjMp/Campers--Copy-?node-id=48768-455),
[Details_error form](https://www.figma.com/design/3hU2HtLFsqHRVtStDTKjMp/Campers--Copy-?node-id=50734-498),
and [UI KIT](https://www.figma.com/design/3hU2HtLFsqHRVtStDTKjMp/Campers--Copy-?node-id=48851-422).
The desktop form is 641 × 382 px (430 px with both errors), with 527 × 60 px
inputs, a 14 px field gap, and a 527 × 56 px Send button. The border is 1 px;
padding inside it is 43 px vertically and 56 px horizontally. Colors, spacing,
and radii reuse the existing design tokens. Focus outlines and pending disabled
states follow existing project conventions because the Figma copy has no
explicit variants for those states.

The visible form has no date or comment fields; the calendar in UI KIT is hidden.
The [Swagger contract](https://campers-api.goit.study/docs) documents only required
`name` and `email`, and HTTP 201 with `{ message: string }`. Date availability and
date reservation are not implemented.

Run `npm run test:booking` with Node.js 22.6+ for the API transport tests.
They replace the Axios adapter and cannot create real bookings. Browser checks
for validation, pending, duplicate submissions, success, HTTP/network failures,
and mobile layout were also performed with intercepted POST responses.
No real booking was created during implementation or verification.
