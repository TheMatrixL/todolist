
exports.getDate = function () {   //shortcut the node module and JS function
  const today = new Date();

  options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }
  return today.toLocaleDateString("en-GB", options);
}

// sample of create multiple functions inside same module
// multiple is an object, which mean it have property and method
module.exports.getDay = getDay;

function getDay() {
  const today = new Date();

  options = {
    weekday: "long",

  }
  return today.toLocaleDateString("en-GB", options);
}
