const quotes = require("success-motivational-quotes");

const dailyQuotesController = {
  getQuotes(req, res, next) {
    try {
      // No need to redeclare quotes here
      const dailyQuote = quotes.getTodaysQuote();
      res.status(200).json({success:true, quote: dailyQuote }); // Send the quote as a JSON response
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = dailyQuotesController;
