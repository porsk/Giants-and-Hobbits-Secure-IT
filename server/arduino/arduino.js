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
    switch (data[0]) {
        case 'card': //A card event occured
            let curr_card_key = data[1];
            let action = data[2];

            controller.validateCard(curr_card_key).then((card) => {
                if (card[0]) {
                    //Valid card
                    if (action === 'in') {
                        //Event -> 1. message to display with name
                        sendDataToArduino(port, 'showmessage|' + card[0].owner_name);
                        //Event -> 2. open door
                        sendDataToArduino(port, 'door|open');
                        //Update last usage date and status to active
                        controller.updateCard(card[0]._id, 'active');
                    } else if (action === 'out') {
                        //Update last usage date and status to inactive
                        controller.updateCard(card[0]._id, 'inactive');
                    } else {
                        console.log('Unknown command');
                    }
                } else {
                    //Invalid card

                    //Event -> 1. blik red led
                    sendDataToArduino(port, 'wrongcard');
                    //TODO: Send notificaiton to phone
                }
            });
            break;
        case 'motion':
            break;
        default:
    }
}

const MAX_DATA_LENGTH = 32;

function sendDataToArduino(port, data) {
    if (data.length > MAX_DATA_LENGTH) {
        data = data.substring(0, MAX_DATA_LENGTH);
    } else {
        let len = data.length;

        for (let i = data.length; i < MAX_DATA_LENGTH; i++) {
            data += ' ';
        }
    }

    port.write(data + '\n', (err) => {
        if (err) {
            console.log('Error on write: ', err.message);
        }
        console.log('To Arduino: ' + data);
    });
}
