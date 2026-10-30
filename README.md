# Rú em Miu — Music Player

A full-stack music player: upload your own songs, organise them into playlists and play them in the browser.

## Features

- Upload audio files — the Node.js server streams them to **Firebase Storage** and saves metadata in **Firestore**
- Song library sorted by upload date, with delete (removes both the Firestore record and the stored file)
- Create / delete playlists and add songs to a playlist
- Player with play/pause, next/previous, shuffle, repeat and a seek bar (custom `useMusicPlayer` hook)
- Client-side routing: home, playlist detail, upload, create playlist

## Tech stack

| Layer | Tech |
|---|---|
| Client | React 19, React Router 7, Tailwind CSS 4, Axios, Vite |
| Server | Node.js, Express 5, Multer |
| Data | Firebase Admin SDK — Firestore + Cloud Storage |

## Project structure

```
.
├── index.js          # Express API (upload, songs, playlists)
└── client/           # React app
    └── src/
        ├── api/      # Axios client
        ├── hooks/    # useMusicPlayer
        ├── components/
        └── pages/
```

## API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Upload a song (`multipart/form-data`, field `musicFile`) |
| `GET` | `/songs` | List songs |
| `DELETE` | `/songs/:id` | Delete a song and its file |
| `GET` | `/playlists` | List playlists |
| `POST` | `/playlists` | Create a playlist |
| `PUT` | `/songs/add-to-playlist` | Add a song to a playlist |
| `DELETE` | `/playlists/:id` | Delete a playlist |

## Getting started

**Server** — create `.env` in the project root:

```env
PORT=5000
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

```bash
npm install
node index.js
```

**Client** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

```bash
cd client
npm install
npm run dev
```
