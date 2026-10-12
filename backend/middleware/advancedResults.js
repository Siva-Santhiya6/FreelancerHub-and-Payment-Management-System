/**
 * Reusable Advanced Results Middleware for Express & Mongoose
 * Handles:
 * 1. Searching (Case-insensitive multi-field regex matching)
 * 2. Filtering (Exact match, range operators min/max, arrays like skills)
 * 3. Sorting (Single or multi-field ascending/descending)
 * 4. Pagination (Configurable page & limit with full metadata)
 */
const advancedResults = (model, populate = null, searchableFields = ['title', 'description']) => async (req, res, next) => {
  try {
    let reqQuery = { ...req.query };

    // Fields to exclude from direct database filtering
    const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'q', 'minBudget', 'maxBudget', 'minPrice', 'maxPrice', 'skills'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string and convert comparison operators (gt, gte, lt, lte, in, ne) to MongoDB operators
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|ne)\b/g, match => `$${match}`);
    let filter = JSON.parse(queryStr);

    // 1. Filtering: Budget / Price Range
    const minVal = req.query.minBudget || req.query.minPrice;
    const maxVal = req.query.maxBudget || req.query.maxPrice;
    if (minVal || maxVal) {
      filter.budget = filter.budget || {};
      if (minVal) filter.budget.$gte = Number(minVal);
      if (maxVal) filter.budget.$lte = Number(maxVal);
    }

    // 2. Filtering: Skills (comma-separated or array)
    if (req.query.skills) {
      const skillsArr = Array.isArray(req.query.skills)
        ? req.query.skills
        : req.query.skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsArr.length > 0) {
        filter.skills = { $in: skillsArr.map(s => new RegExp(s, 'i')) };
      }
    }

    // 3. Searching: Multi-field case-insensitive regex search
    const searchTerm = req.query.search || req.query.q;
    if (searchTerm && searchTerm.trim() && searchableFields && searchableFields.length > 0) {
      const regex = { $regex: searchTerm.trim(), $options: 'i' };
      filter.$or = searchableFields.map(field => ({ [field]: regex }));
    }

    // Initialize Mongoose query
    let query = model.find(filter);

    // 4. Select Fields (e.g., select=title,budget)
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // 5. Sorting (e.g., sort=-budget or sort=createdAt)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 6. Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const startIndex = (page - 1) * limit;
    
    // Count total matching documents
    const total = await model.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    // 7. Population
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(p => {
          query = query.populate(p);
        });
      } else {
        query = query.populate(populate);
      }
    }

    // Execute query
    const results = await query;
    const totalPages = Math.ceil(total / limit) || 1;

    // Attach results payload to res.advancedResults
    res.advancedResults = {
      success: true,
      count: results.length,
      total,
      pagination: {
        page,
        limit,
        totalPages,
        totalCount: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        startIndex: total === 0 ? 0 : startIndex + 1,
        endIndex: Math.min(startIndex + results.length, total)
      },
      data: results
    };

    next();
  } catch (err) {
    console.error('advancedResults middleware error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = advancedResults;
