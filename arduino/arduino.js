const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('COM12', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

port.on('open', () => {
    console.log('Serial port is open to the Arduino.');
});

parser.on('data', (data) => {
    console.log(data);
});
