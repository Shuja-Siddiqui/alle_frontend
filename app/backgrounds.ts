import type { Role, PageKey } from "./types/roles";

type BackgroundEntry = {
  /**
   * For gradients or solid colors.
   * Example: "linear-gradient(...)" or "#000000"
   */
  background?: string;
  /**
   * For image-based backgrounds.
   * Example: "url('/assets/backgrounds/student-dashboard.png')"
   */
  backgroundImage?: string;
};

type BackgroundConfig = {
  [role in Role]: {
    [page in PageKey]?: BackgroundEntry;
  };
};

export const BACKGROUNDS: BackgroundConfig = {
  student: {
    // Use background image for login flow
    login: {
      backgroundImage: "url('/assets/background.png')",
    },
    signup: {
      backgroundImage: "url('/assets/background.png')",
    },
    home: {
      backgroundImage: "url('/assets/background.png')",
    },
    // Example image-based background
    dashboard: {
      backgroundImage: "url('/assets/backgrounds/student-dashboard.png')",
    },
  },
  admin: {
    // Use background image for login flow
    login: {
      backgroundImage: "url('/assets/background.png')",
    },
    signup: {
      backgroundImage: "url('/assets/background.png')",
    },
    dashboard: {
      backgroundImage: "url('/assets/background.png')",
    },
    reports: {
      background:
        "linear-gradient(135deg, #141D33 0%, #1D2948 50%, #20082A 100%)",
    },
  },
};


