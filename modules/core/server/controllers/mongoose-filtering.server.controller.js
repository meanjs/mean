// Service for managing Filtering/Parameterized-Queries.

var _query = null;
var _modifiedQuery = null;
var _totalDocumentCount = null;
var _page = 0;
var _take = 50; // default to prevent unreasonable take() requests
var _filters = [];
var _sorting = null;

var service = {
  buildParameterizedQuery: buildParameterizedQuery
};

function buildParameterizedQuery(query, options) {
  _query = query;
  _page = Math.max(0, options.page - 1);
  _take = options.take && options.take <= 150 ? options.take : _take;
  _filters = Array.isArray(options.filters) ? options.filters : _filters;
  _sorting = options.sorting && options.sorting.length ? options.sorting : _sorting;

  return new Promise(function (resolve, reject) {
    // Add filters to the query
    _filters.forEach(function (filter) {
      query = query.where(filter);
    });

    // Add sorting to the query if specified
    if (_sorting) {
      query.sort(_sorting);
    }

    // Perform count query so we have an accurate
    // count of the documents for pagination.
    query.count(function (err, count) {
      _totalDocumentCount = count;

      if (err) {
        // Send back error
        reject(err);
      } else {
        // Add paging options to query
        _modifiedQuery = query.skip(_page * _take).limit(_take);
        // Send back modified query, and count
        resolve({
          query: _modifiedQuery,
          count: _totalDocumentCount
        });
      }
    });
  });
}

module.exports = service;
