# Next.js + Phaser Game Template

A modern game development template combining Next.js and Phaser 3 with TypeScript support.

## Features

- Next.js 15.3.1
- Phaser 3.90.0
- TypeScript 5
- React 19
- Hot module reloading
- React-Phaser communication bridge

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Build for Production

```bash
npm run build
```

## Project Structure

- `src/pages/` - Next.js pages
- `src/game/` - Phaser game code
- `src/game/scenes/` - Phaser scenes
- `public/assets/` - Game assets

## React-Phaser Bridge

Use the EventBus to communicate between React and Phaser:

```typescript
// In React
import { EventBus } from './game/EventBus';
EventBus.emit('event-name', data);

// In Phaser Scene
EventBus.on('event-name', (data) => {
    // Handle event
});
```

## License

MIT
