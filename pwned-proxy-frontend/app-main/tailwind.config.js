// tailwind.config.js
module.exports = {
  darkMode: 'class',  // using the 'class' strategy for dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // update this to match your project structure
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Tokyo Night Light (light mode) palette
        'tnLight-bg':    '#e6e7ed',   // Light background :contentReference[oaicite:26]{index=26}
        'tnLight-text':  '#343b58',   // Light text (foreground) :contentReference[oaicite:27]{index=27}
        'tnLight-accent': '#2959aa',  // Light primary accent (blue) :contentReference[oaicite:28]{index=28}
        'tnLight-muted': '#6c6e75',   // Light muted text (comment) :contentReference[oaicite:29]{index=29}
        'tnLight-border': '#c1c2c7',  // Light border color

        'tnLight-red':    '#8c4351',  // red accents :contentReference[oaicite:30]{index=30}
        'tnLight-orange': '#965027',  // orange accents :contentReference[oaicite:31]{index=31}
        'tnLight-yellow': '#8f5e15',  // yellow/gold accents :contentReference[oaicite:32]{index=32}
        'tnLight-green':  '#385f0d',  // green accents :contentReference[oaicite:33]{index=33}
        'tnLight-teal':   '#33635c',  // teal/green accents :contentReference[oaicite:34]{index=34}
        'tnLight-cyan':   '#006c86',  // cyan/blue accents :contentReference[oaicite:35]{index=35}
        'tnLight-purple': '#5a3e8e',  // purple/magenta accents :contentReference[oaicite:36]{index=36}

        // Tokyo Night Storm (dark mode) palette
        'tnStorm-bg':    '#24283b',   // Dark background :contentReference[oaicite:37]{index=37}
        'tnStorm-text':  '#a9b1d6',   // Dark text (foreground) :contentReference[oaicite:38]{index=38}
        'tnStorm-accent': '#3d59a1',  // Dark primary accent (navy) :contentReference[oaicite:39]{index=39}
        'tnStorm-muted': '#565f89',   // Dark muted text (comment) :contentReference[oaicite:40]{index=40}
        'tnStorm-border': '#1b1e2e',  // Dark border color

        'tnStorm-red':    '#f7768e',  // red accents :contentReference[oaicite:41]{index=41}
        'tnStorm-orange': '#ff9e64',  // orange accents :contentReference[oaicite:42]{index=42}
        'tnStorm-yellow': '#e0af68',  // yellow/gold accents :contentReference[oaicite:43]{index=43}
        'tnStorm-green':  '#9ece6a',  // green accents :contentReference[oaicite:44]{index=44}
        'tnStorm-teal':   '#73daca',  // teal accents :contentReference[oaicite:45]{index=45}
        'tnStorm-cyan':   '#7dcfff',  // cyan/light-blue accents :contentReference[oaicite:46]{index=46}
        'tnStorm-blue':   '#7aa2f7',  // blue accents :contentReference[oaicite:47]{index=47}
        'tnStorm-purple': '#bb9af7',   // purple/magenta accents :contentReference[oaicite:48]{index=48}

        'deic-green':     '#BFD730'
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],  // Monospace font suggestion
        // 'sans': ['Inter', 'sans-serif'], // example if you want to override default sans
      }
    }
  },
  plugins: [
    // ... e.g., require('@tailwindcss/typography') if needed
  ]
}
