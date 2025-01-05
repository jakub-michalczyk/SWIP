declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): void;
    userChoice: Promise<{ outcome: string; platform: string }>;
  }
}

export {};
