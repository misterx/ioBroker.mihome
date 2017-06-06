'use strict';
function DoorSensor(sid, hub) {
    this.type    = 'magnet';
    this.sid     = sid;
    this.hub     = hub;
    this.opened  = null;
    this.voltage = null;
    this.percent = null;
}

DoorSensor.prototype.getData = function (data) {
    var newData = false;
    var obj = {};
    if (data.voltage !== undefined) {
        data.voltage = parseInt(data.voltage, 10);
        this.voltage = data.voltage / 1000;
        this.percent = ((data.voltage - 2200) / 10);
        obj.voltage  = this.voltage;
        obj.percent  = this.percent;
        newData = true;
    }
    if (data.status) {
        this.opened = data.status !== 'close';
        obj.state   = this.opened;
        newData     = true;
    }

    return newData ? obj : null;
};

DoorSensor.prototype.heartBeat = function (token, data) {
    if (data) {
        var obj = this.getData(data);
        if (obj) {
            this.hub.emit('data', this.sid, this.type, obj);
        }
    }
};
DoorSensor.prototype.onMessage = function (message) {
    if (message.data) {
        var obj = this.getData(message.data);
        if (obj) {
            this.hub.emit('data', this.sid, this.type, obj);
        }
    }
};
module.exports = DoorSensor;