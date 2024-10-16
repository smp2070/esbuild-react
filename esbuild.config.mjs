import esbuild from "esbuild";
import browserSync from "browser-sync";

const isDev = process.env.NODE_ENV === "development";
let bs; // Variable to hold Browsersync instance
let ctx; // Variable to hold ESBuild context

const buildOptions = {
  entryPoints: ["src/index.jsx"], // Entry point for your React app
  bundle: true, // Bundle all dependencies
  outfile: "public/bundle.js", // Output to public directory
  loader: { ".js": "jsx", ".jsx": "jsx" }, // Handle JSX files
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
  jsxFactory: "React.createElement", // Handle React JSX correctly
  jsxFragment: "React.Fragment", // Handle React fragments
  sourcemap: true, // Generate sourcemaps for debugging
  minify: !isDev, // Only minify in production
};

async function buildAndWatch() {
  try {
    if (isDev) {
      ctx = await esbuild.context(buildOptions);

      bs = browserSync.create();
      bs.init({
        server: "./public", // Serve from the public directory
        files: ["./public/bundle.js"], // Watch bundle.js file in the public directory for changes
        port: 3000, // Run the server on port 3000
        open: true, // Automatically opening the browser
        notify: false, // Show notifications in the browser when it reloads
      });

      await ctx.watch();
      console.log("Watching for changes...");
    } else {
      await esbuild.build(buildOptions);
      console.log("Build complete.");
    }
  } catch (error) {
    console.error("Error during build process:", error);
    process.exit(1);
  }
}

// Handle process shutdown (e.g., Ctrl + C)
function cleanup() {
  console.log(">>> Shutting down...");
  if (bs) bs.exit(); // Stop Browsersync
  if (ctx) ctx.dispose(); // Dispose of ESBuild context to stop file watching
  process.exit();
}

// Capture process termination signals
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

buildAndWatch();
