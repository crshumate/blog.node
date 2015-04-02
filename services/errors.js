exports.returnErrors = function(err) {
    var err_arr = [];

    for (var i in err.errors) {
        err_arr.push({
            type: "danger",
            message: err.errors[i].message
        });
    }

    return err_arr;
}
