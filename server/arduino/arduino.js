const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var controller = require('./controller');
var apiController = require('../api/controllers');

/*controller.addCard({
    card_key: '123456',
    owner_name: 'Krisztian',
});*/

exports.establishConnection = () => {
    const port = new SerialPort('COM12', { baudRate: 9600 });
    const port2 = new SerialPort('COM3', { baudRate: 19200 });
    const parser = port.pipe(new Readline({ delimiter: '\n' }));
    const parser2 = port2.pipe(new Readline({ delimiter: '\n' }));

    port2.on('open', () => {
        console.log('Serial port is open to the Arduino.');
    });

    port.on('open', () => {
        console.log('Serial port is open to the Arduino.');
    });

    parser.on('data', (data) => {
        console.log('From Arduino: ' + data);
        processIncomingEvent(data.trim().split('|'), port);
    });
};

function processIncomingEvent(data, port) {
    switch (data[0]) {
        case 'card': //A card event occured
            let curr_card_key = data[1];
            let action = data[2];

            controller.validateCard(curr_card_key).then((card) => {
                if (card[0]) {
                    //Valid card
                    if (action === 'in') {
                        //Event -> 1. message to display with name
                        sendDataToArduino(port, ['showmessage', card[0].owner_name]);
                        //Event -> 2. open door
                        sendDataToArduino(port, ['door', 'open']);
                        //Update last usage date and status to active
                        controller.updateCard(card[0]._id, 'active');
                    } else if (action === 'out') {
                        setTimeout(() => {
                            //Update last usage date and status to inactive
                            controller.updateCard(card[0]._id, 'inactive');
                            //Event -> 1. close the door
                            sendDataToArduino(port, ['door', 'close']);
                        }, 10 * 1000);
                    } else {
                        console.log('Unknown command');
                    }
                } else {
                    //Invalid card

                    //Event -> 1. blik red led
                    sendDataToArduino(port, ['card', 'wrong']);
                    //TODO: Send notificaiton to phone
                    apiController.sendNotification(
                        'Wrong card!',
                        'Someone tried to unlock your house with an invalid card.'
                    );
                }
            });
            break;
        case 'motion':
            break;
        default:
    }
}

const MAX_MESSAGE_LENGTH = 32;

function sendDataToArduino(port, data) {
    var message = '';
    for (d of data) {
        message += d + '|';
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        console.error('Error, too long message');
        return;
    } else {
        for (let i = message.length; i < MAX_MESSAGE_LENGTH; i++) {
            message += ' ';
        }
    }

    port.write(message + '\n', (err) => {
        if (err) {
            console.log('Error on write: ', err.message);
        }
        console.log('To Arduino: ' + message);
    });
}
