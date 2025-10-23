const xlsx = require("xlsx");

/**
 * Envía un array de objetos como archivo xlsx al cliente.
 * name: nombre del archivo con extensión .xlsx
 */
function sendXlsx(res, dataArray, filename = "export.xlsx") {
  // Convertir objetos a hoja
  const ws = xlsx.utils.json_to_sheet(dataArray);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "players");

  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
}

module.exports = { sendXlsx };
