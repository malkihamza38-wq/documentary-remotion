# Documentary Remotion

Crée des vidéos documentaires cinématographiques avec du code React.

## Installation

```bash
npm install
```

## Démarrer le studio

```bash
npm start
```

## Render la vidéo

```bash
npm run render
```

## Scènes disponibles

| Type | Description |
|------|-------------|
| `title` | Écran titre avec animation d'apparition |
| `quote` | Citation avec style doré cinématographique |
| `fact` | Fait avec style futuriste et scan line |
| `chapter` | Séparateur de chapitre numéroté |
| `narration` | Texte narration style typewriter + Ken Burns |
| `stat` | Statistique animée avec compteur |
| `outro` | Écran de fin |

## Personnaliser ton documentaire

Modifie `src/Root.tsx` → change le tableau `scenes` pour construire ton documentaire scène par scène.

```tsx
scenes: [
  { id: 'intro', type: 'title', text: 'Mon Documentaire', subtitle: 'Mon sous-titre', duration: 150 },
  { id: 'ch1', type: 'chapter', number: 1, text: 'Le Début', duration: 120 },
  { id: 'narr1', type: 'narration', text: 'Voici ma narration...', duration: 240 },
  // ...
]
```

**`duration`** = nombre de frames (30fps → `150` = 5 secondes)
