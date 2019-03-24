const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var controller = require('./controller');
var apiController = require('../api/controllers');

/*controller.addCard({
    card_key: '123456',
    owner_name: 'Krisztian',
});*/

exports.establishConnection = () => {
    const acs = new SerialPort('COM12', { baudRate: 9600 });
    const smc = new SerialPort('COM3', { baudRate: 9600 });
    const acsParser = acs.pipe(new Readline({ delimiter: '\n' }));
    const smcParser = smc.pipe(new Readline({ delimiter: '\n' }));

    acs.on('open', () => {
        console.log('Serial port is open to the Access Control System (Arduino 1).');
    });

    smc.on('open', () => {
        console.log('Serial port is open to the Sensors and Motors Control System (Arduino 2).');
    });

    acsParser.on('data', (data) => {
        console.log('From ASC (A1): ' + data);
        processIncomingEventForACS(data.trim().split('|'), acs, smc);
    });

    smcParser.on('data', (data) => {
        console.log('From SMC (A2): ' + data);
        processIncomingEventForSMC(data.trim().split('|'), smc);
    });
};

function processIncomingEventForSMC(data, smc) {
    switch (data[0]) {
        case 'alert':
            switch (data[1]) {
                case 'motion':
                    controller.getHomeStatus().then((config) => {
                        if (!config[0].motionAlert) {
                            console.log('motion alert activated');
                            controller.activateMotionAlert();
                            apiController.sendNotification(
                                'Motion alert!',
                                'Motion detected in the ' + (data[2] === '1' ? 'kitchen' : 'bedroom') + '!',
                                { type: 'motion' }
                            );
                        }
                    });

                    break;
                case 'flame':
                    controller.getHomeStatus().then((config) => {
                        if (!config[0].flameAlert) {
                            console.log('flame alert activated');
                            controller.activateFlameAlert();
                            apiController.sendNotification('Fire alert!', 'Fire detected in the house!', {
                                type: 'flame',
                            });
                        }
                    });

                    break;
                case 'methane':
                    controller.getHomeStatus().then((config) => {
                        if (!config[0].methaneAlert) {
                            console.log('methane alert activated');
                            controller.activateMethaneAlert();
                            apiController.sendNotification(
                                'Methane leakage alert!',
                                'Methane leakage detected in the house!',
                                { type: 'methane' }
                            );
                        }
                    });

                    break;
            }

        default:
    }
}

//in home: flame, methane -> event and push; set light mode to SMART LIGHTS
//out home: motion, flame, methane -> event and push; set light mode to imHOMEsimulation

function alertIfNecessary() {}

function processIncomingEventForACS(data, asc, smc) {
    switch (data[0]) {
        case 'card': //A card event occured
            let curr_card_key = data[1];
            let action = data[2];

            controller.validateCard(curr_card_key).then((card) => {
                if (card[0]) {
                    //Valid card
                    if (action === 'in') {
                        //Event -> 1. message to display with name on ACS
                        sendDataToArduino(asc, ['showmessage', card[0].owner_name]);
                        //Event -> 2. open door on SMC
                        sendDataToArduino(smc, ['door', 'open']);
                        //Update last usage date and status to active
                        controller.updateCard(card[0]._id, 'active');
                    } else if (action === 'out') {
                        setTimeout(() => {
                            //Update last usage date and status to inactive
                            controller.updateCard(card[0]._id, 'inactive');
                            //Event -> 1. close the door on SMC
                            sendDataToArduino(smc, ['door', 'close']);
                        }, 10 * 1000);
                    } else {
                        console.log('Unknown command');
                    }
                } else {
                    //Invalid card
                    if (action == 'in') {
                        //Event -> 1. blik red led on ASC
                        sendDataToArduino(asc, ['card', 'wrong']);
                        //TODO: Send notificaiton to phone
                        apiController.sendNotification(
                            'Wrong card!',
                            'Someone tried to unlock your house with an invalid card.',
                            { type: 'card' }
                        );
                    }
                }
            });
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
