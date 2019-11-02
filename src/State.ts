import KeepContext from '.';
import { Memento } from 'vscode';

/**
 * State
 *
 * Manage the state used in the Keep Context.
 */
export default class State {
  /**
   * @param workspaceState Storage from extension context.
   */
  constructor(readonly workspaceState: Memento) {}

  /**
   * Get the active task.
   */
  get activeTask(): string | null {
    return this.workspaceState.get("activeTask", null);
  }

  /**
   * Set the active task.
   */
  set activeTask(taskId: string | null) {
    this.workspaceState.update("activeTask", taskId);
  }

  /**
   * Get the task list
   */
  get tasks(): { [name: string]: KeepContext.Task } {
    return this.workspaceState.get("tasks", {});
  }

  /**
   * Set the task list
   */
  set tasks(tasks: { [name: string]: KeepContext.Task }) {
    this.workspaceState.get("tasks", tasks);
  }
}
