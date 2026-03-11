import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { TitleScene } from '../components/TitleScene';
import { QuoteScene } from '../components/QuoteScene';
import { FactScene } from '../components/FactScene';
import { ChapterScene } from '../components/ChapterScene';
import { NarrationScene } from '../components/NarrationScene';
import { StatScene } from '../components/StatScene';
import { OutroScene } from '../components/OutroScene';

export type Scene =
  | { id: string; type: 'title'; text: string; subtitle: string; duration: number }
  | { id: string; type: 'quote'; text: string; author: string; duration: number }
  | { id: string; type: 'fact'; text: string; duration: number }
  | { id: string; type: 'chapter'; number: number; text: string; duration: number }
  | { id: string; type: 'narration'; text: string; duration: number }
  | { id: string; type: 'stat'; value: string; unit: string; label: string; duration: number }
  | { id: string; type: 'outro'; text: string; duration: number };

interface Props {
  title: string;
  subtitle: string;
  scenes: Scene[];
}

export const DocumentaryVideo: React.FC<Props> = ({ scenes }) => {
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Series>
        {scenes.map((scene) => {
          switch (scene.type) {
            case 'title':
              return (
                <Series.Sequence key={scene.id} durationInFrames={scene.duration}>
                  <TitleScene text={scene.text} subtitle={scene.subtitle} />
                </Series.Sequence>
              );
            case 'quote':
              return (
                <Series.Sequence key={scene.id} durationInFrames={scene.duration}>
                  <QuoteScene text={scene.text} author={scene.author} />
                </Series.Sequence>
              );
            case 'fact':
              return (
                <Series.Sequence key={scene.id} durationInFrames={scene.duration}>
                  <FactScene text={scene.text} />
                </Series.Sequence>
              );
            case 'chapter':
              return (
                <Series.Sequence key={scene.id} durationInFrames={scene.duration}>
                  <ChapterScene number={scene.number} text={scene.text} />
                </Series.Sequence>
              );
            case 'narration':
              return (
                <Series.Sequence key={scene.id} durationInFrames={scene.duration}>
                  <NarrationScene text={scene.text} />
                </Series.Sequence>
              );
            case 'stat':
              return (
                <Series.Sequence key={scene.id} durationInFrames={scene.duration}>
                  <StatScene value={scene.value} unit={scene.unit} label={scene.label} />
                </Series.Sequence>
              );
            case 'outro':
              return (
                <Series.Sequence key={scene.id} durationInFrames={scene.duration}>
                  <OutroScene text={scene.text} />
                </Series.Sequence>
              );
            default:
              return null;
          }
        })}
      </Series>
    </AbsoluteFill>
  );
};
