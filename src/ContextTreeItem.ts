import * as path from 'path';
import { Command, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { state } from './global';

/**
 * Contexts are used to create expressions to show/hide things.
 * They are used mostly in the package.json
 */
export enum Contexts {
  TASK = 'task_item',
}

/**
 * Icons used in the ContextTreeItem
 */
export enum Icons {
  TASK = 'task.svg',
  TASK_ACTIVE = 'task-active.svg',
}

/**
 * ContextTreeItem
 *
 * Create the item in the tree view responsible to show the tasks.
 */
export class ContextTreeItem extends TreeItem {
  constructor(
    readonly id: string,
    readonly label: string,
    readonly active: boolean,
    readonly contextValue: string,
    readonly collapsibleState: TreeItemCollapsibleState,
    readonly command?: Command,
  ) {
    super(label, collapsibleState);

    const imagesPath = path.join(__filename, '..', '..', 'images');
    const taskIcon = this.active ? Icons.TASK_ACTIVE : Icons.TASK;

    this.iconPath = {
      dark: path.join(imagesPath, 'dark', taskIcon),
      light: path.join(imagesPath, 'light', taskIcon),
    };

    this.tooltip = this.getTooltip();
  }

  /**
   * Extract tasks from settings and create a ContextTreeItem.
   *
   * @param state Extension state
   */
  static fromState(): ContextTreeItem[] {
    console.log('task', state.tasks);
    return Object.values(state.tasks).map((task) => {
      return new ContextTreeItem(
        task.id,
        task.name + ' ' + task.updatedAt,
        task.isActive,
        Contexts.TASK,
        TreeItemCollapsibleState.None,
        {
          arguments: [task.id],
          command: 'keepContext.activateTask',
          title: '',
        },
      );
    });
  }

  /**
   * Get tooltip for the Tree Item.
   */
  private getTooltip(): string {
    let tooltip = this.label;

    if (this.active) {
      tooltip += ' (Active)';
    }

    return tooltip;
  }
}
