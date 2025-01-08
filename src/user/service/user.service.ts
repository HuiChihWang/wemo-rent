import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUserByUserName(userName: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userName });
  }
}
