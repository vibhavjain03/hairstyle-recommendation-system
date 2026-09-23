import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Express] Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer().catch((err) => {
  console.error('[Fatal Error] Express startup failed:', err);
});
