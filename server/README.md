# zanahorario server

## Migrations
* Generate
```bash
npx typeorm migration:generate -n <MigrationClassName>
```

* Run
```bash
npx typeorm migration:run
```

* Rollback
```bash
npx typeorm migration:revert
```

## Creating a new database table
We are using TypeORM to manage the database schema, and to access the data.
With the migrations we make sure all the schema changes are commited in the repo, and versioned.
This way everyone can install the latest changes in any environment, by running the new migrations.

Every environment will have a table called `migrations` with one row per migration. If there are migration files that are not icluded in that table, it means it is not up-to-date.

More information [here](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md).

1.  Create the entity class. For an example, look at the `src/entities/`.

    When specifing the columns, remember:
    * Specify the length for string columns.
    * By default the columns are NOT NULL. If needed use the `nullable: true`.

    Example:
    ```javascript
    @Column({ length: 20, nullable: true })
    newField: string;
    ```

2. Create the migration, running the following command:
    ```bash
    npx typeorm migration:generate -n <MigrationClassName>
    ```
    This command will generate a TypeScript class in `src/migrations/` with a timestamp at the beginning of the file name.
    This migration will allow us to create the table in the database, but first make sure it is compiled (should be a Javascript file in `dist/default/src/migrations/`.

    If you are running the solution with `npm run dev` it will be compiled automatically, otherwise execute `npx kc build` in the `server` folder.

3. Execute the migration
    ```bash
    npx typeorm migration:run
    ```
    When running this command, TypeORM needs to determine which migrations haven't been executed by looking into the local `migration` table of the database.
    This is why the CLI (`typeorm`) needs access to the database. We need to specify in the `server/ormconfig.json` the DB server, user and password.

    If the command finished successfully, there should be a new table in the database.


## Making schema changes
When changes in existing tables are required, change the entities approprietly and run the command to generate a migration. It will automatically detect the changes and generate the `ALTER` sentences:
```bash
npx typeorm migration:generate -n <MigrationClassName>
```
It is also possible to write the migrations on our own. See [here](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#using-migration-api-to-write-migrations) for more info.

## Accessing data
First we need to get the entity's repository, then call any of the available functions.
Example to find a user:
```javascript
const userRepository = await getRepository(User);
const user = await userRepository.findOne({ email, password });
```

For examples about respositories, how to insert or delete data, see [here](https://github.com/typeorm/typeorm#using-repositories).

## Joining tables
To join tables or to fetch related data, the entity has to specify that relationship.
```javascript
@Entity()
export class Author {
    ...

    @OneToMany(type => Photo, photo => photo.author)
    photos: Photo[];
}
```

Click [here](https://github.com/typeorm/typeorm#creating-a-many-to-one--one-to-many-relation) for more information about 1-to-many and many-to-1 relationships.
For information about loading related data, visit this [page](https://github.com/typeorm/typeorm#loading-objects-with-their-relations).
