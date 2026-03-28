/**
 * Google Apps Script - KSLB Questionnaires
 * Sauvegarde les bilans des patients dans Google Drive
 * Structure: APP BILANS/Patients Data/{Nom_Prenom_NumSecu}/{Sous-dossier}/{fichier.txt}
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.parameter.payload);
    var action = payload.action;
    
    if (action === 'submitBilan') {
      return handleSubmitBilan(payload);
    } else if (action === 'test') {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Script fonctionne correctement!'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Action inconnue: ' + action
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'KSLB Script actif. Utilisez POST pour soumettre des bilans.'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSubmitBilan(payload) {
  var filesToCreate = payload.filesToCreate;
  var results = [];
  
  for (var i = 0; i < filesToCreate.length; i++) {
    var fileInfo = filesToCreate[i];
    var pathParts = fileInfo.path.split('/');
    var fileName = pathParts.pop();
    
    // Créer/trouver les dossiers récursivement
    var currentFolder = DriveApp.getRootFolder();
    for (var j = 0; j < pathParts.length; j++) {
      var folderName = pathParts[j];
      var folders = currentFolder.getFoldersByName(folderName);
      if (folders.hasNext()) {
        currentFolder = folders.next();
      } else {
        currentFolder = currentFolder.createFolder(folderName);
      }
    }
    
    // Vérifier si le fichier existe déjà et le supprimer
    var existingFiles = currentFolder.getFilesByName(fileName);
    while (existingFiles.hasNext()) {
      existingFiles.next().setTrashed(true);
    }
    
    // Créer le fichier
    var file = currentFolder.createFile(fileName, fileInfo.content, MimeType.PLAIN_TEXT);
    results.push({
      path: fileInfo.path,
      fileId: file.getId(),
      url: file.getUrl()
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: results.length + ' fichiers créés avec succès',
    files: results
  })).setMimeType(ContentService.MimeType.JSON);
}
