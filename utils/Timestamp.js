module.exports = function timestamp(schema) {
    //add the two fields
    schema.add({
        created_at: Date,
        updated_at: Date,
    });
    //create pres-save hook
    schema.pre("save", function(next) {
        let now = new Date();
        // Set a value for updated_at only if created_at is null
        this.updated_at = now;
        console.log(this.updated_at)
            // Set a value for created_at only if it is null
        if (!this.created_at) {
            this.created_at = now;
        }
        next();
    });

};