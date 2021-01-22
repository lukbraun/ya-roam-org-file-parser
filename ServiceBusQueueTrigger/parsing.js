const { C } = require('@masala/parser');

const whitespaceParser = () => C.char(' ').optrep();

const untilLineBreakParser = () => C.notString('\n').rep()

const title = () => C.stringLiteral().or(untilLineBreakParser());

const titleParser = () => C.string('#+title:').then(whitespaceParser()).drop().then(title()).map(x => x.value.reduce((acc, res) => ({
    ...acc,
    value: [acc.value + res]
}), { value: [], type: 'title' }));

const tagOrAlias = () => whitespaceParser().drop().then(C.stringLiteral().or(C.letters()))

const tagAliasCollector = (name) => tagOrAlias().rep().map(x => x.value.reduce((acc, res) => ({
    ...acc,
    value: [...acc.value, res]
}), { value: [], type: name }));

const tagAliasParser = (name) => C.string(`#+${name}:`).then(whitespaceParser()).drop().then(tagAliasCollector(name))

const tagOrAliasParser = () => tagAliasParser('alias').or(tagAliasParser('tags')).then(whitespaceParser().drop()).then(C.char('\n').opt().drop())

const stringInReferenceParser = () => C.notChar(']').rep().map(x => x.value)

const endParser = () => C.char(']').or(C.char('[')).drop();

const reference = () => C.string('[[')
    .then(C.string("file:"))
    .drop()
    .then(stringInReferenceParser())
    .then(endParser().rep())
    .then(stringInReferenceParser())
    .then(endParser().rep())
    .map(x => x.value.map(y => y.reduce((acc, res) => ({ ...acc, value: [acc.value + res] })
        , { type: "reference", value: [] }))[0])

const textParser = () => reference().or((C.letters()).or(C.char(' ').or(C.notChar(' '))).drop()).rep()

const documentParser = () => titleParser().then(C.char('\n').drop()).then(tagOrAliasParser().optrep()).then(textParser())

module.exports = {
    documentParser
}
