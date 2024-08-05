const Holiday = require("../../models/holidaysList");

const holidayController = {
  async viewHoliday(req, res, next) {
    try {
      const currentYear = new Date().getFullYear();
      const holidays = await Holiday.find();

      // Filter holidays to include only those in the current year
      const currentYearHolidays = holidays.filter(holiday => {
        const holidayYear = new Date(holiday.date).getFullYear();
        return holidayYear === currentYear;
      });

      // Map the filtered holidays to only include date and holidayName
      const formattedHolidays = currentYearHolidays.map(holiday => ({
        holidayDate: holiday.date,
        holidayName: holiday.holidayName,
      }));

      res.json({ success: true, holidays: formattedHolidays });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = holidayController;
