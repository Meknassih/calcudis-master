const stringTranspositionJS = `function stringTransposition(encryptedString, secret) {
  let transposedString = '';
  let strLower = encryptedString.toLowerCase();

  for (let i = 0; i < strLower.length; i++) {
    let charcode = strLower.charCodeAt(i);
    let transposedChar = '';
    transposedChar = String.fromCharCode((((charcode + secret) - 97) % 26) + 97);
    transposedString = transposedString.concat(transposedChar);
  }

  return transposedString;
}`;

const stringTranspositionTS = `function stringTransposition(encryptedString: string, secret: number): string {
  let transposedString = '';
  let strLower = encryptedString.toLowerCase();

  for (let i = 0; i < strLower.length; i++) {
    let charcode = strLower.charCodeAt(i);
    let transposedChar: string;
    transposedChar = String.fromCharCode((((charcode + secret) - 97) % 26) + 97);
    transposedString = transposedString.concat(transposedChar);
  }

  return transposedString;
}`;

const supportedClients = [
  'javascript',
  'js',
  'typescript',
  'ts'
];
Object.freeze(supportedClients);

function getAlgorithm(language) {
  switch (language) {
    case 'js':
    case 'javascript':
    case undefined:
      return stringTranspositionJS;

    case 'ts':
    case 'typescript':
      return stringTranspositionTS;

    default:
      throw undefined;
  }
}

module.exports = { getAlgorithm, supportedClients };