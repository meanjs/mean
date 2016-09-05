// Service for managing Filtering/Parameterized-Queries.

var service = (function () {
  function service(query, options) {
    this._query = query;
    this._modifiedQuery = null;
    this._totalDocumentCount = null;
    this._page = options.page ? Math.max(0, options.page - 1) : null;
    this._take = options.take && options.take >= 0 ? options.take : null;
    this._filters = Array.isArray(options.filters) ? options.filters : [];
    this._sorting = options.sorting && options.sorting.length ? options.sorting : null;

    if (this._take > 300) {
      // Provide a default take.
      // This should probably be in the env configs.
      this._take = 50;
    }
  }

  service.prototype.pageSortFilter = pageSortFilter;

  return service;
}());

function pageSortFilter(performCountQuery) {
  var self = this;

  return new Promise(function (resolve, reject) {

    // Add sorting to the query if specified
    self._modifiedQuery = sort(self._query, self._sorting);

    // Add any provided filters to the query
    self._modifiedQuery = filter(self._modifiedQuery, self._filters);

    if (performCountQuery) {
      // Perform count query so we have an accurate
      // count of the documents for pagination.
      self._modifiedQuery.count(function (err, count) {
        self._totalDocumentCount = count;

        if (err) {
          // Send back error
          reject(err);
        } else {

          // Configure the query's pagination options
          self._modifiedQuery = page(self._modifiedQuery, self._take, self._page);

          // Send back modified query, and count
          resolve({
            query: self._modifiedQuery,
            count: self._totalDocumentCount
          });
        }
      });
    } else {
      // Configure the query's pagination options
      self._modifiedQuery = page(self._modifiedQuery, self._take, self._page);

      // Send back the modified query
      resolve({
        query: self._modifiedQuery
      });
    }
  });
}

function page(query, take, page) {
  // There's no need to modify the query
  // at this point if no "take" was provided.
  // The "take" is required for the skip() &
  // limit() methods of the Mongoose query.
  if (!take) {
    return query;
  }

  // Only apply the skip() method when
  // a "page" was specified. Otherwise,
  // just apply take().
  return page ? query.skip(page * take).limit(take) : query.limit(take);
}

function sort(query, sorting) {
  if (!sorting) {
    return query;
  }

  return query.sort(sorting);
}

function filter(query, filters) {
  // Apply each provided filter
  // by appending a where() condition
  // to the query for each.
  filters.forEach(function (filter) {
    query = query.where(filter);
  });

  return query;
}

module.exports = service;
