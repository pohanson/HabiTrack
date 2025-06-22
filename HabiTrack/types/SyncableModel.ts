/**
 * SyncableModel interface ensures that properties required for synchronization
 * are present in the model.

 * @property {string} id - 16 character unique identifier, generated based on the current timestamp and a random string.
 * @property {string} createdAt - ISO date string representing when the model was created.
 * @property {string} modifiedAt - ISO date string representing when the model was last modified.
 * @property {boolean} isDeleted - Whether the model has been soft-deleted. Defaults to false.
 *
 * ISO date string format: "YYYY-MM-DDTHH:mm:ss.sssZ".
 */
export interface SyncableModel {
  /**
   * 16 character unique identifier, generated based on the current timestamp and a random string.
   */
  id: string;
  /**
   * ISO date string representing when the model was created.
   */
  createdAt: string;
  /**
   * ISO date string representing when the model was last modified.
   */
  modifiedAt: string;
  /**
   * Whether the model has been soft-deleted. Defaults to false
   * @default false
   */
  isDeleted?: boolean;
}
