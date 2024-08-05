const cron = require('node-cron');
const mongoose = require('mongoose');
const { getHolidays } = require('public-holidays'); // Import getHolidays function
const moment = require('moment');
const Holiday = require('../models/holidaysList'); // Adjust the path accordingly

mongoose.connect('mongodb://localhost:27017/xploreMindsDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

const options = { country: 'in', lang: 'en' };

const updateHolidays = async () => {
  const year = new Date().getFullYear(); // Get the current year
  console.log(`Fetching holidays for year: ${year}`);

  try {
    const holidays = await getHolidays({ ...options, year }); // Pass the current year to getHolidays
    console.log('Fetched holidays:', holidays);

    if (!holidays || holidays.length === 0) {
      console.error('No holidays found');
      return;
    }

    // Filter holidays starting from a specific date
    const startDate = new Date("2024-01-01T18:30:00.000Z"); // Specify your start date
    const filteredHolidays = holidays.filter(holiday => new Date(holiday.date) >= startDate);

    if (!filteredHolidays || filteredHolidays.length === 0) {
      console.error('No holidays found starting from the specified date');
      return;
    }

    const formattedHolidays = filteredHolidays.map(holiday => ({
      holidayName: holiday.name,
      date: moment(holiday.date).format('DD-MM-YYYY')
    }));

    console.log('Formatted holidays:', formattedHolidays);

    await Holiday.deleteMany({});
    console.log('Old holidays deleted');

    const result = await Holiday.insertMany(formattedHolidays);
    console.log('Holidays added successfully', result);
  } catch (err) {
    console.error('Error updating holidays:', err);
  }
};

// Schedule task to run at midnight on January 1st every year
cron.schedule('0 0 1 1 *', updateHolidays);
updateHolidays(); 

module.exports = updateHolidays;
