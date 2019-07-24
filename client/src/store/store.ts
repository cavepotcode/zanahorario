import { IUserState } from './user';
import { IProjectState } from './projects';

export interface IStore {
  on: (action: string, handler: Function) => void;
  dispatch: Function;
}

export interface IState {
  user: IUserState;
  projects: IProjectState;
}
