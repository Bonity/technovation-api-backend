import { User } from '../entities/user.entity';
import { UserViewModel } from '../types/userViewModel';

export function UserToUserViewModelMapper(user: User): UserViewModel {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    createdAt: user.created_at,
  };
}

export function UsersToUserViewModelsMappers(users: User[]): UserViewModel[] {
  return users.map((user) => UserToUserViewModelMapper(user));
}
