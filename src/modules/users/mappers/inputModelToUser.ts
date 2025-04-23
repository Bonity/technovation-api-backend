import { UserInputModel } from '../types/userInputModel';
import { User } from '../entities/user.entity';

export const inputModelToUser = (userInput: UserInputModel): Partial<User> => {
  return {
    first_name: userInput.firstName,
    last_name: userInput.lastName,
    email: userInput.email,
    password: userInput.password,
    accepted_terms: userInput.acceptedTerms,
  };
};
