// import sql from "@/backend/connection";

class ExampleRepository {

   async sampleMethod(){
        // return sql`SELECT * FROM example`.execute();
        return { example: 'ok' }
    }

}

export const exampleRepository = new ExampleRepository();