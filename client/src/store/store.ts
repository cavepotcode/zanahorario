import { IUserState } from './user';
import { IProjectState } from './projects';

export interface IStore {
  on: (action: string, handler: Function) => void;
  dispatch: Function;
}

export interface IState {
  help: boolean;
  user: IUserState;
  projects: IProjectState;
}
