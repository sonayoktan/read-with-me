export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'stopwatch';

export interface BackgroundPreset {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  type: 'image' | 'video';
}

export interface Quote {
  text: string;
  author: string;
  book?: string;
}

export interface AmbientTrack {
  id: string;
  name: string;
  icon: string;
  volume: number;
  isPlaying: boolean;
}
