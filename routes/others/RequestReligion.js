// routes/requestReport.js
import express from 'express';
import ReligionRequest from '../../models/other/ReligionRequest.js';

const router = express.Router();

router.post('/request-report', async (req, res) => {
  try {
    const { religion, state, LGA, phone } = req.body;

    // Validate required fields
    if (!religion || !state || !LGA || !phone) {
      return res.status(400).json({
        message: 'Religion, state, LGA, and phone are required',
      });
    }

    // Create new religion request
    const religionRequest = new ReligionRequest({
      religion,
      state,
      LGA,
      phone,
      requestDate: new Date(), // Auto-generate request date
    });

    // Save to MongoDB
    await religionRequest.save();

    console.log('Religion request saved:', {
      religion,
      state,
      LGA,
      phone,
      requestDate: religionRequest.requestDate.toISOString(),
    });

    res.status(201).json({
      message: 'Religion request submitted successfully',
      data: {
        id: religionRequest._id,
        religion,
        state,
        LGA,
        phone,
        requestDate: religionRequest.requestDate,
      },
    });
  } catch (error) {
    console.error('Error saving religion request:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: 'Failed to submit religion request',
      error: error.message,
    });
  }
});

export default router;