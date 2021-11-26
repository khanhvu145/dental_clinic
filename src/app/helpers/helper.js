var funcs = {
    timeToMins: function(time) {
        var b = time.split(':');
        return Number(b[0] * 60) + Number(b[1]);
    },
    timeFromMins: function(mins) {
        function z(n) {
            if (n < 0) return ('-0' + (n).toString().slice(1));
            return (n < 10 ? '0' : '') + n;
        };
        var h = (mins / 60 | 0);
        var m = mins % 60;
        return z(h) + ':' + z(m);
    },
    addTimes: function(time0, time1) {
        return this.timeFromMins(this.timeToMins(time0) + this.timeToMins(time1));
    },
    subTimes: function(time0, time1) {
        return this.timeFromMins(this.timeToMins(time0) - this.timeToMins(time1));
    },
    getDateFromHours: function(date, time) {
        time = time.split(':');
        let now = new Date(date);
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
    },
    addZero: function(i) {
        if (i < 10) {i = "0" + i}
        return i;
    },
};

module.exports = funcs;