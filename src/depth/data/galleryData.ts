export interface GalleryItem {
  id: string;
  label: string;
  pms: string;
  hex: string;
  accentColor: [number, number, number]; // RGB 0-1
  backgroundColor: [number, number, number];
  blob1Color: [number, number, number];
  blob2Color: [number, number, number];
  // For documentary use: replace with your own image URLs
  // In Remotion, use staticFile() or external URLs
  imageUrl: string;
}

export const galleryData: GalleryItem[] = [
  {
    id: 'golden',
    label: 'Golden',
    pms: 'PMS 135 C',
    hex: '#FFC844',
    accentColor: [1.0, 0.78, 0.27],
    backgroundColor: [0.05, 0.04, 0.02],
    blob1Color: [0.45, 0.28, 0.05],
    blob2Color: [0.22, 0.14, 0.01],
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9a?w=800&q=80',
  },
  {
    id: 'violet',
    label: 'Violet',
    pms: 'PMS 2075 C',
    hex: '#8B31C7',
    accentColor: [0.54, 0.19, 0.78],
    backgroundColor: [0.04, 0.02, 0.07],
    blob1Color: [0.22, 0.05, 0.35],
    blob2Color: [0.12, 0.02, 0.22],
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    id: 'afterglow',
    label: 'Afterglow',
    pms: 'PMS 710 C',
    hex: '#FF6B8A',
    accentColor: [1.0, 0.42, 0.54],
    backgroundColor: [0.07, 0.02, 0.03],
    blob1Color: [0.4, 0.08, 0.14],
    blob2Color: [0.22, 0.04, 0.08],
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80',
  },
  {
    id: 'cobalt',
    label: 'Cobalt',
    pms: 'PMS 286 C',
    hex: '#004B97',
    accentColor: [0.0, 0.29, 0.59],
    backgroundColor: [0.01, 0.03, 0.08],
    blob1Color: [0.02, 0.1, 0.3],
    blob2Color: [0.01, 0.05, 0.18],
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9a?w=800&q=80',
  },
  {
    id: 'meadow',
    label: 'Meadow',
    pms: 'PMS 361 C',
    hex: '#43B02A',
    accentColor: [0.26, 0.69, 0.16],
    backgroundColor: [0.02, 0.05, 0.01],
    blob1Color: [0.06, 0.25, 0.03],
    blob2Color: [0.03, 0.14, 0.01],
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9a?w=800&q=80',
  },
];
