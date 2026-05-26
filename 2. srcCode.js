/**
 * MaintTrack Pro - Google Apps Script Backend Engine
 * Open Source Project for Lean Manufacturing Databases
 */

function doPost(e) {
// Configure CORS headers to allow requests from any origin (Plant tablets)
  var output = ContentService.createTextOutput();
  
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("database_logs");
    
    // If the tab doesn't exist, it is created automatically with the clean industrial structure
    if (!sheet) {
      sheet = spreadsheet.insertSheet("database_logs");
      sheet.appendRow([
        "timestamp", "reporter_identity", "work_shift", "technician_name", 
        "asset_id", "process_area", "failure_classification", 
        "initial_symptom", "corrective_actions", "preventive_measures", 
        "spare_parts_availability", "requested_part_number", "response_time_stamp", 
        "startup_time_stamp", "asset_final_status", "engineering_notes", "calculated_downtime_min", "active_permits"
      ]);
      // Format the header in bold for an executive view
      sheet.getRange("1:1").setFontWeight("bold").setBackground("#f3f3f3");
    }
    
    // Process the JSON payload sent from the client app
    var data = JSON.parse(e.postData.contents);
    
    // Write maintenance data to the next available row
    sheet.appendRow([
      new Date(), // Servidor Timestamp
      data.reporter_id || "N/A",
      data.shift || "N/A",
      data.name || "N/A",
      data.machine || "N/A",
      data.process || "N/A",
      data.classification || "N/A",
      data.symptom || "N/A",
      data.corrective || "N/A",
      data.preventive || "N/A",
      data.spare || "N/A",
      data.partnum || "None",
      data.response || "N/A",
      data.startup || "N/A",
      data.status || "N/A",
      data.notes || "None",
      data.downtime !== undefined ? data.downtime : "N/A",
      data.permits ? data.permits.join(", ") : "None"
    ]);
    
    var responseObj = { "status": "success", "message": "Data successfully committed to Google Sheets Grid." };
    return output.setContent(JSON.stringify(responseObj)).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    var errorObj = { "status": "error", "message": error.toString() };
    return output.setContent(JSON.stringify(errorObj)).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Optional endpoint to check Google server status from the browser
  return ContentService.createTextOutput(JSON.stringify({
    "status": "operational",
    "engine": "Google Apps Script Serverless Gateway",
    "timestamp": new Date()
  })).setMimeType(ContentService.MimeType.JSON);
}
