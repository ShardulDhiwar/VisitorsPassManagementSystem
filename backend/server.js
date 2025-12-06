import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DBConnection from './config/db.js';
import visitorRoute from './routes/visitorRoute.js';
import appointmentRoute from './routes/appointmentRoute.js'

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

DBConnection();

app.use("/api/visitors", visitorRoute);
app.use("/api/appointments", appointmentRoute);

app.get('/', (req, res) => {
    res.json({ message: "server working for Visitors" });
})

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
