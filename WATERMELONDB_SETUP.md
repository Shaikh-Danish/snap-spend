# WatermelonDB Setup — Expo SDK 55

> Tested on Expo SDK 55 / React Native 0.85 / pnpm

---

## ⚠️ Prerequisites

- Expo SDK 55 project (managed or bare workflow)
- **pnpm** as package manager (adjust commands for npm/yarn if needed)
- Xcode (for iOS builds) / Android Studio (for Android builds)
- **Expo Go will NOT work** — WatermelonDB requires a custom dev client

---

## Step 1 — Install Dependencies

```bash
pnpm expo install @nozbe/watermelondb
pnpm expo install expo-build-properties
pnpm add @lovesworking/watermelondb-expo-plugin-sdk-52-plus
pnpm add -D @babel/plugin-proposal-decorators
pnpm add @nozbe/with-observables rxjs
```

> ⚠️ Do NOT use `@morrowdigital/watermelondb-expo-plugin` — it is outdated and broken on SDK 52+.

---

## Step 2 — babel.config.js

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
  };
};
```

---

## Step 3 — app.json Plugins

```json
{
  "expo": {
    "plugins": [
      ["@lovesworking/watermelondb-expo-plugin-sdk-52-plus"],
      [
        "expo-build-properties",
        {
          "ios": {
            "extraPods": [
              {
                "name": "simdjson",
                "configurations": ["Debug", "Release"],
                "path": "../node_modules/@nozbe/simdjson",
                "modular_headers": true
              }
            ]
          },
          "android": {
            "packagingOptions": {
              "pickFirst": ["**/libc++_shared.so"]
            }
          }
        }
      ]
    ]
  }
}
```

> **Apple Silicon (M1/M2) simulator issue?** Add `"excludeSimArch": true` to the plugin options:
> ```json
> ["@lovesworking/watermelondb-expo-plugin-sdk-52-plus", { "excludeSimArch": true }]
> ```

---

## Step 4 — package.json Scripts

Add these so you always run expo from the local project (not via pnpm dlx cache):

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios"
  }
}
```

---

## Step 5 — Database Files

### `db/schema.ts`

```ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'posts',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'body', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
```

### `db/migrations.ts`

```ts
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [],
});
```

### `db/models/Post.ts` (example model)

```ts
import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Post extends Model {
  static table = 'posts';

  @field('title') title!: string;
  @field('body') body!: string;
  @readonly @date('created_at') createdAt!: Date;
}
```

### `db/index.ts`

```ts
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import migrations from './migrations';
import Post from './models/Post';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Post],
});
```

---

## Step 6 — First Native Build (once per machine)

```bash
# Android
pnpm android

# iOS
pnpm ios
```

This takes ~5 minutes. **You only need to do this once per machine**, or when you add/change native packages.

---

## Daily Development Workflow

```bash
# ✅ Use this every day — just starts the JS bundler, no native rebuild
pnpm start
# then press 'a' for Android or 'i' for iOS
```

```bash
# ❌ Don't use this daily — triggers full 5-min native build every time
pnpm android
pnpm ios
```

Only re-run the native build if you:
- Add a new native/Expo plugin package
- Modify `app.json` plugins
- Pull changes that include new native dependencies

---

## Troubleshooting

### `Cannot find module 'expo-router/_ctx-shared'`

Caused by pnpm running expo from the global dlx cache instead of your local project.

```bash
pnpm expo install expo-router
```

Then always use `pnpm start` / `pnpm android` (scripts in `package.json`), never `npx expo` or `pnpm dlx expo`.

---

### `Could not find host.exp.exponent:expo.modules.X`

A package version is mismatched with your SDK. Run:

```bash
pnpm expo install --fix
```

This realigns all native packages to the correct SDK 55 versions.

---

### CMake / Gradle build fails after `--fix` or package version change

When packages are swapped, stale CMake cache causes the build to choke on missing codegen JNI directories (`GLOB mismatch`, `not an existing directory`). Fix:

```bash
# Delete stale CMake cache
rm -rf android/app/.cxx

# Clean Gradle
cd android && ./gradlew clean && cd ..

# Rebuild
pnpm android
```

**Full nuclear reset** (if the above still fails):

```bash
rm -rf android/app/.cxx
rm -rf android/build
rm -rf android/app/build
rm -rf node_modules/.cache

cd android && ./gradlew clean && cd ..

pnpm android
```

---

### Other common errors

| Error | Fix |
|---|---|
| App crashes on Android launch | Check `pickFirst: ['**/libc++_shared.so']` is in `expo-build-properties` |
| iOS simulator build fails on M1/M2 | Add `"excludeSimArch": true` to the plugin options |
| Decorators not working / syntax errors | Ensure `legacy: true` is set in the Babel decorator plugin |
| `@morrowdigital` plugin errors | Replace with `@lovesworking/watermelondb-expo-plugin-sdk-52-plus` |
| 5-minute build on every restart | You're running `expo run:android` — switch to `expo start` for daily dev |

---

## Notes

- JSI is enabled automatically on Android by the plugin (fast synchronous DB access)
- Always bump `schema version` and add a migration entry when you change your schema
- WatermelonDB does **not** work in Expo Go under any circumstances
- When setting up on a new machine, run `pnpm android` once for the native build, then use `pnpm start` going forward