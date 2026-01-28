# AI Agent Rules

Panduan untuk AI agent dalam mengerjakan project ini.

## Tech Stack

- **Frontend**: React 19, TanStack Router, TanStack Query
- **Backend**: Express, tRPC
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Language**: TypeScript

## Path Alias

Gunakan `@/` untuk import dari `src/`:

```typescript
import { Button } from "@/components/ui/button";
import { trpc } from "@/router";
import { queryClient } from "@/lib/query-client";
```

---

## tRPC API Calls

### Suspense Query (✅ Recommended)

Gunakan `useSuspenseQuery` untuk data fetching. Data dijamin ada di component.

```typescript
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "@/router";
import { CardSkeleton } from "@/components/loaders";

// Parent component dengan Suspense boundary
function ParentPage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <DataComponent />
    </Suspense>
  );
}

// Child component - data dijamin ada
function DataComponent() {
  // ✅ useSuspenseQuery mengembalikan object { data }
  const { data: greeting } = useSuspenseQuery(trpc.hello.greet.queryOptions());

  return <div>{greeting}</div>; // Tidak perlu cek isLoading/isError
}
```

### Route Loader + Suspense (Best Practice)

Prefetch data di loader untuk render-as-you-fetch pattern:

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "@/router";

export const Route = createFileRoute("/example")({
  // Prefetch saat navigasi
  loader: async () => {
    await queryClient.ensureQueryData(trpc.example.list.queryOptions());
  },
  component: ExamplePage,
});

function ExamplePage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <ExampleContent />
    </Suspense>
  );
}

function ExampleContent() {
  // Data sudah di-prefetch, tidak ada loading
  const { data: items } = useSuspenseQuery(trpc.example.list.queryOptions());
  return <>{/* render items */}</>;
}
```

### Regular Query (Fallback)

Gunakan `useQuery` hanya jika butuh kontrol manual atas loading state:

```typescript
import { useQuery } from "@tanstack/react-query";

const query = useQuery(trpc.hello.greet.queryOptions());

// Harus handle loading/error state secara manual
if (query.isLoading) return <Spinner />;
if (query.isError) return <Error />;
return <div>{query.data}</div>;
```

### Mutation (POST/PUT/DELETE)

```typescript
import { useMutation } from "@tanstack/react-query";
import { trpc, queryClient } from "@/router";

const mutation = useMutation(
  trpc.posts.create.mutationOptions({
    onSuccess: () => {
      // ✅ Invalidate cache setelah mutation berhasil
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  }),
);

mutation.mutate({ title: "New Post" });
```

### Invalidation Pattern

```typescript
import { queryClient } from "@/router";

// Invalidate specific key
queryClient.invalidateQueries({ queryKey: ["posts"] });

// Invalidate dengan filter
queryClient.invalidateQueries({
  queryKey: ["posts"],
  predicate: (query) => query.queryKey[1] === "list",
});
```

---

## Environment & Configuration

Project ini menggunakan strict validation untuk environment variable.

### `src/lib/env.ts`

**JANGAN** mengakses `process.env` secara langsung di application code (kecuali di config file seperti `vite.config.ts`). Gunakan helper `env` dari `@/lib/env`:

```typescript
// ✅ Correct
import { env } from "@/lib/env";
console.log(env.DATABASE_URL);

// ❌ Wrong
console.log(process.env.DATABASE_URL);
```

### Adding New Env Vars

1. Tambahkan di `.env` dan `.env.example`.
2. Validasi di `src/lib/env.ts` menggunakan Zod:

const envSchema = z.object({
  // ...
  NEW_VAR: z.string(),
});
```

### Client-Side Variables (VITE_)

Jika variable dibutuhkan di client-side (React), prefix dengan `VITE_`. Variable ini **JUGA WAJIB** divalidasi di `src/lib/env.ts` agar build/server gagal jika config salah.

```typescript
const envSchema = z.object({
  // Server only
  DATABASE_URL: z.string().url(),
  
  // Client exposed
  VITE_API_URL: z.string().url(),
});
```

Ini memastikan aplikasi **Gagal Start** jika konfigurasi belum lengkap, mencegah error runtime aneh.

---

## Caching Strategy

QueryClient dikonfigurasi dengan:

| Setting              | Value | Deskripsi                            |
| -------------------- | ----- | ------------------------------------ |
| `staleTime`          | 5 min | Data fresh, tidak refetch otomatis   |
| `gcTime`             | 30min | Cache bertahan untuk navigasi        |
| `refetchOnMount`     | false | Tidak refetch saat component mount   |
| `refetchOnFocus`     | false | Tidak refetch saat tab aktif kembali |
| `refetchOnReconnect` | false | Tidak refetch saat network reconnect |

**Prinsip**: Data TIDAK akan refetch otomatis. Gunakan invalidation setelah mutation.
**RULES MUTASI**:
Setiap kali melakukan mutasi (POST/PUT/DELETE/PATCH), **WAJIB** melakukan `invalidateQueries` pada `onSuccess` callback.

❌ **JANGAN** hardcode query key:
```typescript
queryClient.invalidateQueries({ queryKey: ["todo", "list"] }); // ❌ Rawan typo/mismatch
```

✅ **GUNAKAN** `queryOptions().queryKey` untuk type-safety:
```typescript
onSuccess: () => {
    // Ambil key yang presisi dari definisi trpc
    queryClient.invalidateQueries({
        queryKey: trpc.todo.list.queryOptions().queryKey,
    });
}
```

---

## UI Components

### Rules & Consistency

1. **Prioritaskan Shadcn UI**: Selalu gunakan komponen dari shadcn/ui (`https://ui.shadcn.com/`) untuk menjaga konsistensi desain UI/UX.
2. **Install on Demand**: Jika komponen yang dibutuhkan belum ada di project, **jangan buat manual**. Install langsung dari shadcn:
   ```bash
   npx shadcn@latest add [nama-component]
   ```
   Contoh: `npx shadcn@latest add button`

### Usage

Gunakan shadcn/ui dari `@/components/ui/`:

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

### Loading State

```tsx
{
  query.isLoading ? (
    <Skeleton className="h-8 w-full" />
  ) : query.isError ? (
    <p className="text-destructive">Error: {query.error.message}</p>
  ) : (
    <div>{query.data}</div>
  );
}
```

### Suspense & Loaders

Gunakan komponen loader dari `@/components/loaders`:

```tsx
import { PageLoader, Spinner, CardSkeleton } from "@/components/loaders";
```

| Component      | Penggunaan                            |
| -------------- | ------------------------------------- |
| `PageLoader`   | Full page loading (Suspense fallback) |
| `Spinner`      | Inline spinner untuk tombol/komponen  |
| `CardSkeleton` | Loading skeleton untuk card           |

#### Suspense Pattern

```tsx
import { Suspense } from "react";
import { PageLoader } from "@/components/loaders";

// ✅ Wrap lazy component dengan Suspense
<Suspense fallback={<PageLoader />}>
  <LazyComponent />
</Suspense>;
```

#### Route dengan pendingComponent

```tsx
export const Route = createFileRoute("/example")({
  component: ExamplePage,
  pendingComponent: PageLoader, // Loading saat data di-fetch
  errorComponent: ErrorComponent, // Error boundary
});
```

**Note**: Router sudah dikonfigurasi dengan `defaultPendingComponent: PageLoader`

---

## Folder Structure

```
src/
├── components/ui/       # shadcn components
├── features/            # ✅ Feature-based modules (User, Auth, Post, etc.)
│   └── [feature-name]/
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific hooks
│       └── utils/       # Feature-specific utils
├── lib/
│   ├── utils.ts         # cn() helper
│   └── query-client.ts  # QueryClient config
├── routes/              # TanStack Router pages
├── router.tsx           # Router + tRPC setup
└── server/
    └── trpc/
        ├── index.ts           # Main exports
        ├── context.ts         # Request context
        ├── init.ts            # tRPC init
        ├── procedures.ts      # Procedure builders
        ├── middleware/        # Custom middleware
        └── routers/           # Domain routers
            ├── index.ts       # Root router
            └── *.router.ts    # Feature routers
```

### Clean Code & Modularity

**Feature-Based Architecture**:

- Gunakan folder `src/features/[feature-name]` untuk fitur baru yang kompleks.
- Jangan tumpuk semua component di `src/components` jika hanya dipakai oleh fitur tertentu.
- **Rules**:
  - Jika sebuah component/hook/util hanya dipakai oleh satu fitur -> Taruh di `src/features/[feature-name]/`.
  - Jika dipakai global/shared -> Taruh di `src/components/`, `src/hooks/`, atau `src/lib/`.

### Site Configuration & Branding

Gunakan `@/lib/site` untuk semua teks branding agar konsisten.

```typescript
import { siteConfig } from "@/lib/site";

// ✅ Benar
<h1>{siteConfig.name}</h1>
<p>{siteConfig.description}</p>

// ❌ Salah (Hardcoded)
<h1>Tanstack+Kakrey</h1>
```

---

## Adding New tRPC Router

1. Buat file `src/server/trpc/routers/[name].router.ts`:

```typescript
import { z } from "zod";
import { createTRPCRouter } from "../init";
import { publicProcedure, loggedProcedure } from "../procedures";

export const exampleRouter = createTRPCRouter({
  list: loggedProcedure.query(async () => {
    return []; // data from DB
  }),

  create: loggedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return { id: "1", name: input.name };
    }),
});
```

2. Register di `src/server/trpc/routers/index.ts`:

```typescript
import { exampleRouter } from "./example.router";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  example: exampleRouter, // tambahkan di sini
});
```

---

## Validation

Jalankan setelah task selesai:

```bash
npm run check
```

Pastikan:

- Server berjalan tanpa error
- UI menampilkan data dengan benar
- Perubahan file server trigger nodemon restart

---

---
## Database Schema

Database schema diatur menggunakan Drizzle ORM dengan struktur modular.

### Structure

Module schema berada di `src/server/db/schema/`:

- `index.ts`: Entry point yang meng-export semua tabel.
- `[table].ts`: Definisi tabel individual.

### Menambahkan Tabel Baru

1. Buat file baru di `src/server/db/schema/[nama-tabel].ts`:

```typescript
import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

2. Export tabel tersebut di `src/server/db/schema/index.ts`:

```typescript
export * from "./todos";
export * from "./posts"; // ✨ Tambahkan export baru
```

3. Jalankan migration:
```bash
npm run db:generate
npm run db:push
```

---

## Toast Notification (Custom Sonner)

Gunakan utility `@/lib/toast` yang mengekspor fungsi spesifik: `toastSuccess`, `toastError`, `toastInfo`, `toastLoading`.

### Basic Usage

```typescript
import { toastSuccess, toastError, toastInfo } from "@/lib/toast";

toastSuccess("Berhasil disimpan");
toastError("Terjadi kesalahan");
toastInfo("Informasi update");
```

### Undo Action

Gunakan properti `action` untuk tombol undo:

```typescript
toastError("Todo deleted", {
  action: {
    label: "Undo",
    onClick: () => {
      // Logic untuk restore
    },
  },
});
```

### Features

- **Custom Progress Bar**: Animasi progress bar halus.
- **Custom UI**: Style khusus untuk setiap tipe (Success/Error/Info).
- **Auto Dismiss**: 5 detik (default).

### Best Practice: Data Consistency pada Undo

**CRITICAL**: Ketika menggunakan fitur Undo (misalnya mengembalikan data yang dihapus), pastikan mutasi restore melakukan **invalidation query** agar data langsung muncul kembali di UI.

❌ **Wrong**:
```typescript
toastError("Deleted", {
  action: {
    label: "Undo",
    onClick: () => restoreMutation.mutate(data), // restoreMutation tidak refresh list
  },
});
```

✅ **Correct**:
Pastikan mutation yang dipanggil di `onClick` memiliki `onSuccess` yang me-refresh data:

```typescript
// Di definition hook mutation
const restoreMutation = useMutation(
  trpc.todo.create.mutationOptions({
    onSuccess: () => {
      // 1. Refresh list agar item yang direstore LANSUNG MUNCUL
      queryClient.invalidateQueries({
        queryKey: trpc.todo.list.queryOptions().queryKey,
      });
    },
  })
);

// Di penggunaan toast
toastError("Deleted", {
  action: {
    label: "Undo",
    onClick: () => restoreMutation.mutate(data),
  },
});
```


