import { Howl } from 'howler';

// Define the audio stimuli with GitHub URLs
const audioStimuli = {
  'A': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/a.mp3'],
    preload: true,
    html5: true
  }),
  'B': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/b.mp3'],
    preload: true,
    html5: true
  }),
  'C': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/c.mp3'],
    preload: true,
    html5: true
  }),
  'F': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/f.mp3'],
    preload: true,
    html5: true
  }),
  'H': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/h.mp3'],
    preload: true,
    html5: true
  }),
  'I': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/i.mp3'],
    preload: true,
    html5: true
  }),
  'M': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/m.mp3'],
    preload: true,
    html5: true
  }),
  'O': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/o.mp3'],
    preload: true,
    html5: true
  }),
  'T': new Howl({ 
    src: ['https://raw.githubusercontent.com/pocchamanex/n-back/main/t.mp3'],
    preload: true,
    html5: true
  }),
};

export type AudioStimulus = keyof typeof audioStimuli;

// Play a specific audio stimulus
export const playAudioStimulus = (stimulus: AudioStimulus) => {
  const sound = audioStimuli[stimulus];
  if (sound) {
    sound.play();
  }
};

// Stop all audio
export const stopAllAudio = () => {
  Object.values(audioStimuli).forEach(sound => sound.stop());
};

// Preload all audio files
export const preloadAudio = () => {
  Object.values(audioStimuli).forEach(sound => sound.load());
};

// Check if audio is supported
export const isAudioSupported = () => {
  return Howler.usingWebAudio;
};

// Set global volume (0.0 to 1.0)
export const setVolume = (volume: number) => {
  Howler.volume(Math.max(0, Math.min(1, volume)));
};

// Get current global volume
export const getVolume = () => {
  return Howler.volume();
};

// Cache audio files in memory
export const cacheAudioFiles = async () => {
  try {
    const promises = Object.values(audioStimuli).map(sound => 
      new Promise((resolve, reject) => {
        sound.once('load', resolve);
        sound.once('loaderror', reject);
      })
    );
    
    await Promise.all(promises);
    console.log('All audio files cached successfully');
  } catch (error) {
    console.error('Error caching audio files:', error);
  }
};