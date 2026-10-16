<div align="center">
  <h1>🚐 TravelTrucks</h1>
  <p><strong>Find a camper. Explore the details. Plan your next adventure.</strong></p>
  <p>A camper rental browsing app with live catalog data, reviews, and booking requests.</p>
  <p>
    <a href="https://travel-trucks-eta-rust.vercel.app/">Live Demo</a> ·
    <a href="https://github.com/dlmak1/travel-trucks">GitHub</a> ·
    <a href="https://www.figma.com/design/3hU2HtLFsqHRVtStDTKjMp/Campers--Copy-?node-id=48730-474">Figma Design</a>
  </p>
  <p>Next.js 16 · React 19 · TypeScript · CSS Modules · TanStack Query</p>
</div>

---

## Overview

TravelTrucks helps travelers browse campers, narrow down their search, and
explore photos, specifications, and customer reviews before sending a booking
request. Built with the Next.js App Router, it combines server-rendered detail
pages with an interactive, cached catalog backed by a real public API.

**Explore:** [Features](#features) · [Routes](#routes) · [Tech Stack](#tech-stack) ·
[Getting Started](#getting-started) · [Scripts](#scripts) ·
[API & Booking](#api--booking) · [Deployment](#deployment) ·
[Project Structure](#project-structure) · [Author](#author)

## Features

### Browse and filter

- Home page with a hero section, catalog call to action, and shared navigation.
- Camper cards with a photo, price, rating, location, and vehicle specifications.
- API-side filtering by **location, camper form, engine, and transmission**.
  Search applies the selected filters; Clear filters resets them.
- **Load More** pagination through `useInfiniteQuery`, requesting four campers
  per page and caching results by filter combination.
- Loading, empty, error, and pagination retry states.
- Camper details open in a new tab from the catalog.

### Explore each camper

- Photo gallery with selectable thumbnails.
- Description, amenities, dimensions, tank capacity, and fuel consumption.
- API-backed reviews with reviewer names and star ratings.
- Streamed reviews with loading, empty, error, and retry states.
- Dynamic page titles, a not-found page for missing campers, and retry feedback
  when details cannot be loaded.

### Send a booking request

- Required **name and email** fields with inline validation and accessible
  error messages, including the browser's email validity check.
- `useMutation` submission with pending feedback and duplicate submission
  protection; automatic retries are disabled.
- API confirmation on success and clear feedback on failure. Successful
  requests clear the form; failed requests preserve the entered values.

### Interface and assets

- Responsive layouts, CSS Modules, and shared design tokens.
- Optimized images with `next/image`; only the first catalog result's photo is
  preloaded, while the remaining catalog photos load lazily.
- Inter and Manrope loaded through `next/font`.
- Custom camper favicon provided by the App Router's `src/app/icon.png`.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home and introduction to the catalog |
| `/catalog` | Camper search, filters, and Load More results |
| `/catalog/[camperId]` | Camper gallery, specifications, reviews, and booking form |

## Tech Stack

| Technology | Role in this project |
| --- | --- |
| **Next.js 16 / React 19** | App Router, server and client components, routing, and metadata |
| **TypeScript 5** | Typed components, API data, and booking payloads |
| **CSS Modules** | Component styles, responsive layouts, and shared CSS tokens |
| **TanStack Query v5** | Catalog caching, `useInfiniteQuery` pagination, and booking `useMutation` |
| **Axios** | Shared API client, request timeout, and API error handling |
| **Next.js image and font tools** | `next/image` optimization and `next/font` typography |
| **ESLint 9 / Node.js test runner** | Linting and focused booking API client tests |
| **Vercel** | Application hosting |

## Getting Started

Use **Node.js 22.14+** and **npm** for development and the included booking tests.
Next.js itself requires Node.js 20.9+; the test script also needs Node's
TypeScript stripping support.

```bash
git clone https://github.com/dlmak1/travel-trucks.git
cd travel-trucks
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

No environment variables or API keys are required by the current implementation.
The API base URL is configured in `src/lib/api.ts`. Internet access is needed for
API data and for downloading Google Fonts during a fresh build.

To build and serve the production application locally:

```bash
npm run build
npm run start
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve an existing production build |
| `npm run lint` | Run ESLint |
| `npm run test:booking` | Run four booking API client tests with mocked transport |

Additional checks:

```bash
npx tsc --noEmit
git diff --check
```

The booking tests cover the request payload, camper ID validation and encoding,
HTTP error handling, and connection failures. They mock Axios's transport and
do not create real booking requests. Form validation and visual behavior need
separate browser checks.

## API & Booking

The application connects to the public Campers API at
`https://campers-api.goit.study`. The request contract is available in the
[Swagger documentation](https://campers-api.goit.study/docs).

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/campers` | Filtered catalog with `page` and `perPage` pagination |
| `GET` | `/campers/{camperId}` | Camper details |
| `GET` | `/campers/{camperId}/reviews` | Customer reviews |
| `POST` | `/campers/{camperId}/booking-requests` | Booking contact request |

A booking sends only trimmed `name` and `email` values. A successful request
returns HTTP 201 with a confirmation message displayed by the form.

The current flow collects contact information for a camper. It has no date or
comment fields, availability checks, or date reservations. Submitting the form
in the application sends a real request to the API.

## Deployment

**Live application:** [TravelTrucks on Vercel](https://travel-trucks-eta-rust.vercel.app/)

To deploy your own copy on Vercel:

1. Import your copy of the GitHub repository into a Vercel project.
2. Select the **Next.js** framework preset and use the repository root directory.
3. Use `npm ci` as the install command and `npm run build` as the build command.
4. Use a Node.js version compatible with Next.js (20.9+). No application
   environment variables are needed for the current public API setup.
5. Deploy and check Home, Catalog, and a camper detail page.

See the [Vercel Next.js deployment guide](https://vercel.com/docs/frameworks/full-stack/nextjs)
for platform configuration.

## Project Structure

```text
public/
├── icons/                    # SVG sprite and booking feedback icon
└── images/                   # Hero, logo, and empty-state assets
src/
├── app/
│   ├── catalog/
│   │   ├── [camperId]/       # Details route and not-found page
│   │   ├── CatalogClient.tsx # Catalog queries and applied filter state
│   │   └── page.tsx          # Catalog route
│   ├── globals.css           # Global styles and design tokens
│   ├── icon.png              # Custom camper favicon
│   ├── layout.tsx            # Shared layout, font, and query provider
│   └── page.tsx              # Home route
├── components/               # UI components and CSS Modules
├── lib/api.ts                # Axios client and API functions
└── types/                    # Camper and booking types
tests/
└── booking-api.test.mjs       # Booking API client tests
```

## Author

**Dmytro Severyn** · [@dlmak1](https://github.com/dlmak1)

[GitHub Repository](https://github.com/dlmak1/travel-trucks) ·
[Live Demo](https://travel-trucks-eta-rust.vercel.app/)
