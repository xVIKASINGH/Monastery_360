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

## Data Models (Prisma Representation)

The project currently uses Mongoose, but here is a Prisma schema representation for easier visualization of the data models and relationships.

```prisma
// This is a representation only. The actual DB is MongoDB (Mongoose).

model User {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  email            String   @unique
  username         String   @unique
  password         String?
  type             UserType @default(USER)
  savedMonasteries Monastery[] @relation(fields: [savedMonasteryIds], references: [id])
  savedMonasteryIds String[] @db.ObjectId
  bookings         Booking[]
  bookedEvents     Event[]   @relation(fields: [bookedEventIds], references: [id])
  bookedEventIds   String[]  @db.ObjectId
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relations owned by User
  hotels           Hotel[]
}

enum UserType {
  user
  hotelier
  monasteryAdmin
}

model Monastery {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  monasteryIdNum    Int? // 'id' field in mongoose
  name              String
  description       String?
  location          Location
  district          String
  images            String[]
  history           String?
  architecture      String?
  foundedYear       Int?
  villageOrTown     String?
  state             String?
  googleMapsLink    String?
  altitude          String?
  buddhistSect      String?
  nearbyAttractions String[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Reverse relations
  events            Event[]
  imagesList        MonasteryImage[]
  narrations        Narration[]
  routes            Route[]
  virtualTours      VirtualTour[]
  digitalArchives   DigitalArchive[]
  hotels            Hotel[] // Hotels near this monastery
  savedByUsers      User[] @relation(fields: [savedByUserIds], references: [id])
  savedByUserIds    String[] @db.ObjectId
}

type Location {
  lat Float
  lng Float
}

model Event {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  monastery        Monastery? @relation(fields: [monasteryId], references: [id])
  monasteryId      String?   @db.ObjectId
  eventName        String
  startDate        String
  endDate          String?
  time             String?
  duration         String?
  location         String?
  description      String?
  highlights       String?
  images           String[]
  bookingAvailable Boolean
  ticketPrice      Float?
  totaltickets     Int?
  bookedTickets    Int       @default(0)

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Reverse relations
  bookings         Booking[]
  bookedByUsers    User[]    @relation(fields: [bookedByUserIds], references: [id])
  bookedByUserIds  String[]  @db.ObjectId
}

model Booking {
  id             String        @id @default(auto()) @map("_id") @db.ObjectId
  user           User          @relation(fields: [userId], references: [id])
  userId         String        @db.ObjectId
  event          Event         @relation(fields: [eventId], references: [id])
  eventId        String        @db.ObjectId
  date           DateTime
  orderId        String
  numberOfPeople Int
  ticketPrice    Float
  totalAmount    Float
  paymentStatus  PaymentStatus @default(PENDING)
}

enum PaymentStatus {
  pending
  success
  failed
}

model Hotel {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  name               String
  description        String?
  images             String[]
  address            String
  pricePerNight      Float
  rating             Float?
  available          Boolean  @default(true)
  owner              User     @relation(fields: [ownerId], references: [id])
  ownerId            String   @db.ObjectId
  closestMonastery   String?
  location           GeoLocation
  googleMapsEmbedUrl String?
  monastery          Monastery? @relation(fields: [monasteryId], references: [id])
  monasteryId        String?    @db.ObjectId

  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

type GeoLocation {
  type        String   @default("Point")
  coordinates Float[] // [lng, lat]
}

model MonasteryImage {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  monastery   Monastery @relation(fields: [monasteryId], references: [id])
  monasteryId String    @db.ObjectId
  title       String
  iframe      String

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Narration {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  monastery   Monastery? @relation(fields: [monasteryId], references: [id])
  monasteryId String?    @db.ObjectId
  language    String?
  audioUrl    String?
  transcript  String?
  voiceType   VoiceType?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum VoiceType {
  ai
  real
}

model Route {
  id               String    @id @default(auto()) @map("_id") @db.ObjectId
  monastery        Monastery? @relation(fields: [monasteryId], references: [id])
  monasteryId      String?    @db.ObjectId
  nearestBusStop   String?
  nearestTaxiStand String?
  travelTime       String?
  lat              Float?
  lng              Float?
  routeDescription String?

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model VirtualTour {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  monastery       Monastery? @relation(fields: [monasteryId], references: [id])
  monasteryId     String?    @db.ObjectId
  title           String?
  panoramaUrl     String?
  type            TourType?
  narrationTracks String[]
  metadata        Json?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum TourType {
  interior
  exterior
  aerial
}

model DigitalArchive {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  monastery   Monastery? @relation(fields: [monasteryId], references: [id])
  monasteryId String?    @db.ObjectId
  title       String?
  fileUrl     String?
  description String?
  language    String?
  images      String[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model District {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  district      String
  description   String?
  image         String?
  population    Float
  area_km2      Float
  villages      Float?
  literacy_rate String?
  district_code String
  latitude      Float
  longitude     Float
  languages     String[]
  festivals     String[]
  foods         String[]
}
```

