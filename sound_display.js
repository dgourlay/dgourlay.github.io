'use strict';

const SPEAKER_IP = '192.168.1.25';
const WS_PORT = '8080';
const GET_PORT = '8090';

$(document).ready(function () {

    const x2js = new X2JS();
    const socket = new WebSocket(`ws://${SPEAKER_IP}:${WS_PORT}`, 'gabbo');

    socket.onopen = function () {
        // Get current volume on load
        var baseURL = `http://${SPEAKER_IP}:${GET_PORT}`;
        var getURL = baseURL + "/volume";
        $.get(getURL, {}).done(function (xml) {
            let result = x2js.xml2json(xml);
            console.log(result);
            updateVolume(result.volume.actualvolume);
        });
    };

    socket.onmessage = function (event) {
        console.log(event.data);
        let message = x2js.xml_str2json(event.data);
        if (message.updates && message.updates.volumeUpdated) {
            let volumeUpdate = message.updates.volumeUpdated.volume;
            updateVolume(volumeUpdate.actualvolume);
        }
    };

    function updateVolume(newVal) {
        $("#currentVolume").text(newVal);
    }
});
