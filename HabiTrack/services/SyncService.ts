import { SyncableModel } from '@/types/SyncableModel';
import { supabase } from '@/utils/supabase';
import { BaseSyncableRepoService } from './BaseSyncableRepoService';
import { DEBUG } from '@/constants';

export class SyncService {
  static #instance: SyncService;

  private constructor() {}

  public static init(): SyncService {
    if (!SyncService.#instance) {
      SyncService.#instance = new SyncService();
    }
    return SyncService.#instance;
  }

  static get instance(): SyncService {
    if (!SyncService.#instance) {
      SyncService.#instance = SyncService.init();
    }
    return SyncService.#instance;
  }

  async syncRepoService(repoService: BaseSyncableRepoService) {
    if (repoService.tableName === undefined) {
      console.warn(
        `No upstream table defined for repository: ${repoService.tableName}\nABORTING PULLING`,
      );
      return;
    } else {
    }
    const lastSyncedTimestamp = await repoService.getLastSyncTimestamp();
    // save current timestamp where syncing started
    const syncStartTimestamp = new Date().toISOString();

    let log: (...args: any) => void = () => {};
    if (DEBUG) {
      log = console.log;
    }
    log(`Syncing repository: ${repoService.tableName} at ${syncStartTimestamp}`);
    // push changes changes to remote
    repoService.getModifiedAfter(lastSyncedTimestamp).then((deltas) => {
      log(`Pushing ${deltas.length} deltas to remote for ${repoService.tableName}`);
      supabase
        .from(repoService.tableName)
        .upsert(deltas, { count: 'exact' })
        .then((res) => {
          log(`Successfully pushed deltas to remote for ${repoService.tableName}`, res);
        });
    });
    // fetch and pull changes from remote
    log(`Pulling changes for ${repoService.tableName} since ${syncStartTimestamp}`);
    await supabase
      .from(repoService.tableName)
      .select()
      .then((res) => {
        repoService
          .updateModifiedItems(res.data as SyncableModel[])
          .then(() => repoService.setLastSyncTimestamp(syncStartTimestamp));
      });
  }
  async syncAll() {
    BaseSyncableRepoService.syncRepoService.forEach(this.syncRepoService);
  }
}
