const Timer = require('tiny-timer')
const timer = new Timer({interval: 1000})

let count = 20;
timer.on('tick', (ms) => {
    console.log('tick', count -1)
    count -= 1 
})
timer.on('done', () => console.log('done!'))
timer.start(count * 1000)