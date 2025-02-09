function isAlphaKey(evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  return (
    charCode === 32 ||
    (charCode >= 65 && charCode <= 90) ||
    (charCode >= 97 && charCode <= 122) ||
    charCode === 209 ||
    charCode === 241
  );
}
