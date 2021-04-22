module.exports = (payload, ...allowedFields) => {
    const data = {};
    Object.keys(payload).forEach(element => {
        if (allowedFields.includes(element)) {
            data[element] = payload[element]
        }
    });
    data['updated_at'] = new Date();
    return data;
}