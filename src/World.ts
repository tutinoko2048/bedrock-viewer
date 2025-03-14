import { invoke } from '@tauri-apps/api/core';

interface LoadWorldResult {
  keys: string[];
}

export class World {
  public keys!: string[];
  
  static async load(path: string): Promise<World> {
    const world = new World();
    
    const result = await invoke<LoadWorldResult>('load_world', { path });
    
    world.keys = result.keys;

    return world;
  }

  async get_data(key: string) {
    return invoke('get_data', { key });
  }
}