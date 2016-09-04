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
  if (take !== null) {
    query = query.limit(take);
  }

  if (page !== null & take !== null) {
    query = query.skip(page * take);
  }

  return query;
}

function sort(query, sorting) {
  if (sorting) {
    query = query.sort(sorting);
  }

  return query;
}

function filter(query, filters) {
  filters.forEach(function (filter) {
    query = query.where(filter);
  });

  return query;
}

module.exports = service;
