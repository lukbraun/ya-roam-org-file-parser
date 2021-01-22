module.exports = async function(context, mySbMsg) {
    const parse = (msg) => {
        if(!msg) return {};
        const parsed = documentParser().val(msg.text);
        context.log(`text: ${parsed}`);
        return parsed;
    }
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    const res = parse(mySbMsg);
    const outputSbMsg = {...res, fileName: mySbMsg.fileName}
    context.bindings.outputSbMsg = JSON.stringify(outputSbMsg);
    context.done();
};
