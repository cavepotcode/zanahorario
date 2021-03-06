import { JsonController, Get, Post, Param, Body, Authorize, Put, Delete } from 'kiwi-server';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { ProjectDataInfo } from '../sdk/data_info/project/projectDataInfo';
import { ProjectManager } from '../data_access/projectManager';
import { ProjectService } from '../services/project.service';

@Authorize()
@JsonController('/project')
export class ProjectController {
  constructor(private projectSvc: ProjectService, private manager: ProjectManager) {}

  @Get('')
  public async all() {
    try {
      const projects = await this.projectSvc.all();
      return new Response(ResponseCode.OK, '', projects);
    } catch (err) {
      Log.logError('project/all', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Put('/create')
  public create(@Body() body: ProjectDataInfo) {
    try {
      return this.manager.create(body);
    } catch (err) {
      Log.logError('project/create', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Post('/update')
  public update(@Body() body: ProjectDataInfo) {
    try {
      return this.manager.update(body);
    } catch (err) {
      Log.logError('project/update', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }

  @Delete('/delete/:id')
  public delete(@Param('id') id: string) {
    try {
      return this.manager.delete(id);
    } catch (err) {
      Log.logError('project/delete', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
