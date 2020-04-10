import Bowser from "bowser";

const browser = Bowser.getParser(window.navigator.userAgent);
const { name, version } = browser.getBrowser();
console.log(name, version);
