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
    constructor(private manager: ProjectManager){}

    @Put('/create')
    public Create(@Body() body: ProjectDataInfo) {
        try {
            return this.manager.Create(body);
        }
        catch (err) {
            Log.LogError('project/create', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Post('/update')
    public Update(@Body() body: ProjectDataInfo) {
        try {
            return this.manager.Update(body);
        }
        catch (err) {
            Log.LogError('project/update', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Delete('/delete/:id')
    public Delete(@Param('id') id: string) {
        try {
            return this.manager.Delete(id);
        }
        catch (err) {
            Log.LogError('project/delete', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

    @Get('/getAll')
    public GetAll() {
        try {
            return this.manager.GetAll();
        }
        catch (err) {
            Log.LogError('project/getAll', err);
            return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
        }
    }

}