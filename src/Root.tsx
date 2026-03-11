import { Composition } from 'remotion';
import { DocumentaryVideo } from './compositions/DocumentaryVideo';

export const DocumentaryMain: React.FC = () => {
  return (
    <>
      <Composition
        id="DocumentaryMain"
        component={DocumentaryVideo}
        durationInFrames={30 * 60} // 60 secondes à 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Le Secret de l\'Univers',
          subtitle: 'Un voyage au cœur de l\'espace',
          scenes: [
            {
              id: 'intro',
              type: 'title',
              text: 'Le Secret de l\'Univers',
              subtitle: 'Un voyage au cœur de l\'espace',
              duration: 150,
            },
            {
              id: 'quote1',
              type: 'quote',
              text: '"L\'univers est non seulement plus étrange que nous ne l\'imaginons, mais plus étrange que nous ne pouvons l\'imaginer."',
              author: '— J.B.S. Haldane',
              duration: 180,
            },
            {
              id: 'fact1',
              type: 'fact',
              text: 'L\'univers observable contient plus de 2 trillions de galaxies.',
              duration: 150,
            },
            {
              id: 'chapter1',
              type: 'chapter',
              number: 1,
              text: 'Les Origines',
              duration: 120,
            },
            {
              id: 'narration1',
              type: 'narration',
              text: 'Il y a 13,8 milliards d\'années, tout a commencé par une singularité d\'une densité et d\'une chaleur infinies. En une fraction de seconde, l\'univers est passé de rien à tout.',
              duration: 240,
            },
            {
              id: 'stat1',
              type: 'stat',
              value: '13.8',
              unit: 'milliards d\'années',
              label: 'Âge de l\'univers',
              duration: 150,
            },
            {
              id: 'outro',
              type: 'outro',
              text: 'L\'exploration continue...',
              duration: 150,
            },
          ],
        }}
      />
    </>
  );
};

import React from 'react';
