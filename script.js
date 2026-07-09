const input = document.getElementById("input");
const output = document.getElementById("output");
const mode = document.getElementById("mode");
const words = document.getElementById("words");
const chars = document.getElementById("chars");

const reviseButton = document.getElementById("revise");
const swapButton = document.getElementById("swap");
const clearButton = document.getElementById("clear");
const copyButton = document.getElementById("copy");
const downloadButton = document.getElementById("download");

input.addEventListener("input", updateStats);
reviseButton.addEventListener("click", reviseText);
swapButton.addEventListener("click", useOutputAsDraft);
clearButton.addEventListener("click", clearAll);
copyButton.addEventListener("click", copyOutput);
downloadButton.addEventListener("click", downloadOutput);

function updateStats() {
  const value = input.value.trim();
  const wordCount = value ? value.split(/\s+/).length : 0;
  words.textContent = `${wordCount} words`;
  chars.textContent = `${input.value.length} characters`;
}

function cleanSpacing(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitLongParagraphs(text) {
  return text.replace(/([.!?])\s+(?=[A-Z])/g, "$1\n\n");
}

function replaceWords(text, pairs) {
  let result = text;
  for (const [from, to] of pairs) {
    result = result.replace(new RegExp("\\b" + from + "\\b", "gi"), to);
  }
  return result;
}

function capitalizeSentences(text) {
  return text.replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, match => match.toUpperCase());
}

function reviseText() {
  let text = cleanSpacing(input.value);

  const natural = [
    ["Furthermore", "Also"],
    ["Moreover", "Also"],
    ["In conclusion", "Overall"],
    ["utilize", "use"],
    ["demonstrates", "shows"],
    ["approximately", "about"],
    ["individuals", "people"],
    ["assist", "help"],
    ["significant", "important"]
  ];

  const b2 = [
    ["therefore", "so"],
    ["however", "but"],
    ["approximately", "about"],
    ["require", "need"],
    ["individuals", "people"],
    ["purchase", "buy"],
    ["reside", "live"],
    ["obtain", "get"],
    ["communicate", "talk"]
  ];

  const academic = [
    ["a lot of", "many"],
    ["kids", "children"],
    ["stuff", "things"],
    ["big", "important"],
    ["I think", "I believe"],
    ["talks about", "discusses"],
    ["shows", "demonstrates"]
  ];

  const email = [
    ["I want", "I would like"],
    ["send me", "could you please send me"],
    ["tell me", "could you please let me know"],
    ["thanks", "thank you"],
    ["sorry", "I apologize"]
  ];

  if (mode.value === "natural") text = replaceWords(text, natural);
  if (mode.value === "b2") text = replaceWords(text, b2);
  if (mode.value === "academic") text = replaceWords(text, academic);
  if (mode.value === "email") text = replaceWords(text, email);

  text = splitLongParagraphs(text);
  text = capitalizeSentences(text);
  output.value = text;
}

async function copyOutput() {
  await navigator.clipboard.writeText(output.value);
  alert("Copied!");
}

function useOutputAsDraft() {
  input.value = output.value;
  output.value = "";
  updateStats();
}

function clearAll() {
  input.value = "";
  output.value = "";
  updateStats();
}

function downloadOutput() {
  const blob = new Blob([output.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "revised-text.txt";
  link.click();
}
