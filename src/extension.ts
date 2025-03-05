import * as vscode from 'vscode';

/**
 * Activates the extension.
 * @param context The extension context
 */
export function activate(context: vscode.ExtensionContext) {
  // Register the minify command
  const minifyCommand = vscode.commands.registerCommand('json-formatter.minify', () => {
    formatJson(true);
  });

  // Register the beautify command
  const beautifyCommand = vscode.commands.registerCommand('json-formatter.beautify', () => {
    formatJson(false);
  });

  // Add commands to the extension context
  context.subscriptions.push(minifyCommand, beautifyCommand);
}

/**
 * Formats the JSON in the active editor.
 * @param minify Whether to minify the JSON or not
 */
function formatJson(minify: boolean) {
  const editor = vscode.window.activeTextEditor;
  
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }

  const document = editor.document;
  
  // Check if the document is a JSON file
  if (document.languageId !== 'json' && document.languageId !== 'jsonc') {
    vscode.window.showErrorMessage('Active file is not a JSON file');
    return;
  }

  try {
    // Get the entire document text
    const text = document.getText();
    
    // Parse the JSON to validate it
    const jsonObject = JSON.parse(text);
    
    // Format the JSON
    const formattedJson = minify 
      ? JSON.stringify(jsonObject) 
      : JSON.stringify(jsonObject, null, 2);
    
    // Replace the entire document text with the formatted JSON
    editor.edit(editBuilder => {
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );
      editBuilder.replace(fullRange, formattedJson);
    }).then(success => {
      if (success) {
        const action = minify ? 'minified' : 'beautified';
        vscode.window.showInformationMessage(`JSON ${action} successfully`);
      }
    });
  } catch (error) {
    vscode.window.showErrorMessage(`Error formatting JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Deactivates the extension.
 */
export function deactivate() {} 