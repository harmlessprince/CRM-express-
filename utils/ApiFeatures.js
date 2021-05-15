class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        //Build the query
        const queryObj = {...this.queryString };
        const excludeFields = ["page", "sort", "limit", "fields"];
        //loop thorugh the eclude fields and remove ot from the query object
        excludeFields.forEach((el) => delete queryObj[el]);
        //Adnvaced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        //sorting
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            // sort('variable1 variable2 varibale3')
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }
    limitFields() {
        // Field limiting using select
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            //this exxludes __v from the request
            this.query = this.query.select("-__v");
        }

        return this;
    }
    pagination() {
        //PAGINATION OF RESULT
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit; //number of pages
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = ApiFeatures;