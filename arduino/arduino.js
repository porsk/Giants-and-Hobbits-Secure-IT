const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var controller = require('./controller');

/*controller.addCard({
    card_key: '123456',
    owner_name: 'Krisztian',
});*/

exports.establishConnection = () => {
    const port = new SerialPort('COM12', { baudRate: 9600 });
    const parser = port.pipe(new Readline({ delimiter: '\n' }));

    port.on('open', () => {
        console.log('Serial port is open to the Arduino.');
    });

    parser.on('data', (data) => {
        console.log('From Arduino: ' + data);
        processIncomingEvent(data.trim().split('|'), port);
    });
};

function processIncomingEvent(data, port) {
    console.log('New event from the arduino.');
    console.log(data);

    switch (data[0]) {
        case 'card': //A card event occured
            if (data[2] === 'in') {
                // Card touched
                controller.validateCard('123456').then((data) => {
                    if (data[0]) {
                        //Valid card

                        //Event -> 1. message to display with name
                        sendDataToArduino(port, 'showmessage|Hello ' + data[0].owner_name + '!');
                        //Event -> 2. open door
                        sendDataToArduino(port, 'door|open');
                    } else {
                        //Invalid card

                        //Event -> 1. blik red led
                        sendDataToArduino(port, 'wrongcard');
                        //save wrong card
                    }
                });
            } else if (data[2] === 'out') {
                //TODO:
            } else {
                console.log('Unknown command');
            }
            break;
        default:
    }
}

function sendDataToArduino(port, data) {
    port.write(data + '\n', (err) => {
        if (err) {
            console.log('Error on write: ', err.message);
        }
        console.log('To Arduino: ' + data);
    });
}
