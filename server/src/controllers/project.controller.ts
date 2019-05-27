import { JsonController, Get, Post, Param, Body, Authorize, Put, Delete } from 'kiwi-server';
import { ResponseOut } from '../sdk/response';
import { Enums } from '../sdk/enums';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { ProjectDataInfo } from '../sdk/data_info/project/projectDataInfo';
import { ProjectManager } from '../data_access/projectManager';

@Authorize()
@JsonController('/project')
export class ProjectController {
  constructor(private manager: ProjectManager) {}

  @Put('/create')
  public create(@Body() body: ProjectDataInfo) {
    try {
      return this.manager.create(body);
    } catch (err) {
      Log.logError('project/create', err);
      return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
    }
  }

  @Post('/update')
  public update(@Body() body: ProjectDataInfo) {
    try {
      return this.manager.update(body);
    } catch (err) {
      Log.logError('project/update', err);
      return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
    }
  }

  @Delete('/delete/:id')
  public delete(@Param('id') id: string) {
    try {
      return this.manager.delete(id);
    } catch (err) {
      Log.logError('project/delete', err);
      return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
    }
  }

  @Get('/getAll')
  public getAll() {
    try {
      return this.manager.getAll();
    } catch (err) {
      Log.logError('project/getAll', err);
      return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
    }
  }
}
