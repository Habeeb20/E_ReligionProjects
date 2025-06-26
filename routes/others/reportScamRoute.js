import express from "express"

import ScamReport from '../../models/other/ScamReport.js';
const router = express.Router();

router.post('/scam-report', async (req, res) => {
  try {
    const { complaints, observations, dateOfIncident } = req.body;

    // Validate required fields
    if (!complaints || !observations || !dateOfIncident) {
      return res.status(400).json({
        message: 'Complaints, observations, and date of incident are required',
      });
    }

    // Validate dateOfIncident format
    const incidentDate = new Date(dateOfIncident);
    if (isNaN(incidentDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid date of incident format. Use ISO format (e.g., YYYY-MM-DD)',
      });
    }

    // Create new scam report
    const scamReport = new ScamReport({
      complaints,
      observations,
      dateOfIncident: incidentDate,
      reportDate: new Date(), // Auto-generate report date
    });

    // Save to MongoDB
    await scamReport.save();

    console.log('Scam report saved:', {
      complaints,
      observations,
      dateOfIncident: incidentDate.toISOString(),
      reportDate: scamReport.reportDate.toISOString(),
    });

    res.status(201).json({
      message: 'Scam report submitted successfully',
      data: {
        id: scamReport._id,
        complaints,
        observations,
        dateOfIncident: scamReport.dateOfIncident,
        reportDate: scamReport.reportDate,
      },
    });
  } catch (error) {
    console.error('Error saving scam report:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      message: 'Failed to submit scam report',
      error: error.message,
    });
  }
});

export default router