    
exports.getDate = function() {
    const today = new Date();
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    const day = today.toLocaleDateString("en-US", options);
    // let day = today.toLocaleDateString("hi-IN", options);
    // let day = today.toLocaleDateString("ja-JP", options);

    return day;
};

exports.getDay = function(){
    const today = new Date();
    
    const options = {
        weekday: "long"
    };

    const day = today.toLocaleDateString("en-US", options);
    // let day = today.toLocaleDateString("hi-IN", options);
    // let day = today.toLocaleDateString("ja-JP", options);

    return day;
};
