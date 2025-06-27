import Report from "../../models/other/ReportSchema.js"

import express from "express"

const reportRoute = express.Router()



reportRoute.post('/postreport', async(req, res) => {
     const { nameOfReporter, emailOfReporter, phonenum, nameOfMinister, church, emailOfReported, offense } = req.body;
    console.log(req.body)

 
    const missingFields = [];

    if (!nameOfReporter) missingFields.push("nameOfReporter");
    if (!emailOfReporter) missingFields.push("emailOfReporter");
    if (!phonenum) missingFields.push("phonenum");
    if (!nameOfMinister) missingFields.push("nameOfMinister");
    if (!church) missingFields.push("church");
    if (!emailOfReported) missingFields.push("emailOfReported");
    if (!offense) missingFields.push("offense");


    if (missingFields.length > 0) {
        console.log(`Missing fields: ${missingFields.join(", ")}`);
        return res.status(400).json({ message: `The following fields are missing: ${missingFields.join(", ")}` });
    }

    try {
        const report = new Report({
            nameOfReporter,
            emailOfReporter,
            phonenum,
            nameOfMinister,
            church,
            emailOfReported,
            offense
        });

        await report.save();

        return res.status(201).json({ message: "Report successfully registered", report });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
})


reportRoute.get("/getReport", async(req, res) => {
     try {
        const reports = await Report.find();
        res.status(200).json(reports);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
})


export default reportRoute