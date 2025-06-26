import { SyncableRepository } from '@/repositories/SyncableRepository';
import { SyncableModel } from '@/types/SyncableModel';
import AsyncStorage from '@react-native-async-storage/async-storage';

export abstract class BaseSyncableRepoService {
  static syncRepoService: BaseSyncableRepoService[] = [];
  localRepository: SyncableRepository<SyncableModel>;
  private _tableName: string;

  constructor(localRepository: SyncableRepository<SyncableModel>, tableName: string) {
    this.localRepository = localRepository;
    this._tableName = tableName;
    BaseSyncableRepoService.syncRepoService.push(this);
  }

  public get tableName() {
    return this._tableName;
  }

  async getLastSyncTimestamp(): Promise<string> {
    try {
      const value = null;
      await AsyncStorage.getItem(`lastSyncTimestamp_${this.tableName}`);
      if (!value) {
        return new Date(0).toISOString();
      }
      return value;
    } catch (error) {
      console.error('Error getting last sync timestamp:', error);
      return new Date(0).toISOString(); // Return epoch time if there's an error
    }
  }

  async setLastSyncTimestamp(timestamp: string) {
    await AsyncStorage.setItem(`lastSyncTimestamp_${this.tableName}`, timestamp);
  }

  async getModifiedAfter(lastSyncTimestamp: string | null): Promise<SyncableModel[]> {
    if (!lastSyncTimestamp) {
      lastSyncTimestamp = await this.getLastSyncTimestamp();
    }
    return await this.localRepository.getModifiedAfter(lastSyncTimestamp);
  }

  async updateModifiedItems(items: SyncableModel[]) {
    return await this.localRepository.updateModifiedItems(items);
  }
}
