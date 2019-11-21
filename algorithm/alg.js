function stringTransposition(encryptedString, transposeTo) {
  let transposedString = '';
  let strLower = encryptedString.toLowerCase();

  for (let i = 0; i < strLower.length; i++) {
    let charcode = strLower.charCodeAt(i);
    let transposedChar = '';
    transposedChar = String.fromCharCode((((charcode + transposeTo) - 97) % 26) + 97);
    transposedString = transposedString.concat(transposedChar);
  }

  return transposedString;
}