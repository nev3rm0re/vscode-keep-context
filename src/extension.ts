import * as vscode from 'vscode';
import { CONFIG_SECTION } from './config';
import { init } from './global';
import KeepContext from './KeepContext';
import { changeStorage } from './Storage';
import { getAllOpenedFiles, isTabSupported } from './utils';

export function activate(context: vscode.ExtensionContext): void {
  init(context);

  const keepContext = new KeepContext();

  vscode.window.registerTreeDataProvider('keepContextFork', keepContext.treeDataProvider);

  vscode.commands.registerCommand('keepContextFork.clearState', keepContext.clearState);
  vscode.commands.registerCommand('keepContextFork.newTask', keepContext.newTask);
  vscode.commands.registerCommand('keepContextFork.editTask', keepContext.editTask);
  vscode.commands.registerCommand('keepContextFork.deleteTask', keepContext.deleteTask);
  vscode.commands.registerCommand('keepContextFork.activateTask', keepContext.activateTask);
  vscode.commands.registerCommand('keepContextFork.selectTask', keepContext.selectTask);

  // https://code.visualstudio.com/api/references/vscode-api#Tab
  vscode.window.tabGroups.onDidChangeTabs(async (tabEvent) => {
    const hasClosed = tabEvent.closed.some((tab) => !tab.isPreview && isTabSupported(tab));
    const hasOpened = tabEvent.opened.some((tab) => !tab.isPreview && isTabSupported(tab));
    const hasChanged = tabEvent.changed.some((tab) => !tab.isPreview && isTabSupported(tab));

    if ((hasClosed || hasOpened || hasChanged) && keepContext.isTaskActive()) {
      const files = getAllOpenedFiles();
      keepContext.updateFileList(files);
      await keepContext.updateLayout();
    }
  });

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(CONFIG_SECTION)) {
      changeStorage();
    }
  });

  context.subscriptions.push(keepContext.statusBarItem);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void {}
