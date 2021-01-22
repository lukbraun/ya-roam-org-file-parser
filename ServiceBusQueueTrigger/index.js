const { documentParser } = require('./parsing');

module.exports = async function(context, mySbMsg) {
    const parse = (msg) => {
        if(!msg) return {};
        const parsed = documentParser().val(msg.text);
        context.log(`text: ${JSON.stringify(parsed)}`);
        return parsed;
    }
    context.log('ServiceBus queue trigger function processed message', JSON.stringify(mySbMsg));
    const res = parse(mySbMsg);
    const outputSbMsg = {...res, fileName: mySbMsg.fileName}
    context.bindings.outputSbMsg = JSON.stringify(outputSbMsg);
    context.done();
};
