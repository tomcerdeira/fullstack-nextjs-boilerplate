import { exampleRepository } from "../persistence/example_repository";

class ExampleService{

  protected getRepo(){
    return exampleRepository;
  }

  exampleMethod(){
    return exampleRepository.sampleMethod();
  }

}

export const exampleService = new ExampleService();
