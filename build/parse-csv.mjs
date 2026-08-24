import fs from "node:fs";

const src = "C:/Users/mulk/Desktop/tekken slam suomi materiaalit/csv/Tekken Coach Info.csv";
const data = fs.readFileSync(src, "utf-8");

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
      } else if (c === "\r") {
        // skip
      } else field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const rows = parseCSV(data);
const headers = rows[0];
const out = rows.slice(1).map((r) => {
  const o = {};
  headers.forEach((h, i) => (o[h.trim()] = (r[i] || "").trim()));
  return o;
});

fs.writeFileSync("raw-coaches.json", JSON.stringify(out, null, 2), "utf-8");
console.log("wrote", out.length, "rows");
